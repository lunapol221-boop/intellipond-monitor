import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const ReadingSchema = z.object({
  pond_id: z.string().uuid().optional(),
  do_mg_l: z.number().min(0).max(30).optional(),
  ph: z.number().min(0).max(14).optional(),
  temperature_c: z.number().min(-10).max(60).optional(),
  turbidity_ntu: z.number().min(0).max(4000).optional(),
  recorded_at: z.string().datetime({ offset: true }).optional(),
}).refine(
  (r) => r.do_mg_l !== undefined || r.ph !== undefined || r.temperature_c !== undefined || r.turbidity_ntu !== undefined,
  { message: 'At least one sensor value is required.' }
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Device authentication: the Pi sends its device key in a header.
    const deviceKey = req.headers.get('x-device-key')
    const expectedKey = Deno.env.get('DEVICE_API_KEY')
    if (!expectedKey) {
      return new Response(JSON.stringify({ error: 'Device key not configured on server' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!deviceKey || deviceKey !== expectedKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized device' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const parsed = ReadingSchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const reading = parsed.data

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Resolve pond: use provided pond_id, otherwise fall back to the first pond profile.
    let pondId = reading.pond_id
    if (!pondId) {
      const { data: ponds, error: pondError } = await supabase
        .from('pond_profiles')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
      if (pondError) throw pondError
      if (!ponds || ponds.length === 0) {
        return new Response(JSON.stringify({ error: 'No pond profile exists yet. Create one in the admin panel first.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      pondId = ponds[0].id
    }

    const { data, error } = await supabase
      .from('sensor_readings')
      .insert({
        pond_id: pondId,
        do_mg_l: reading.do_mg_l ?? null,
        ph: reading.ph ?? null,
        temperature_c: reading.temperature_c ?? null,
        turbidity_ntu: reading.turbidity_ntu ?? null,
        ...(reading.recorded_at ? { recorded_at: reading.recorded_at } : {}),
      })
      .select()
      .single()

    if (error) throw error

    // Touch sensor_status so the admin panel shows the sensors as online.
    const sensorTypes: string[] = []
    if (reading.do_mg_l !== undefined) sensorTypes.push('dissolved_oxygen')
    if (reading.ph !== undefined) sensorTypes.push('ph')
    if (reading.temperature_c !== undefined) sensorTypes.push('temperature')
    if (reading.turbidity_ntu !== undefined) sensorTypes.push('turbidity')

    for (const sensorType of sensorTypes) {
      await supabase
        .from('sensor_status')
        .upsert(
          { pond_id: pondId, sensor_type: sensorType, status: 'online', last_sync: new Date().toISOString(), error_message: null },
          { onConflict: 'pond_id,sensor_type' }
        )
    }

    return new Response(JSON.stringify({ ok: true, reading: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
