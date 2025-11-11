import { defineFlow } from '@genkit-ai/core';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

/**
 * Zod schema for a single log entry and for the array of entries.
 */
const LogEntry = z.object({
  type: z.enum(['trip', 'fuel', 'maintenance']),
  miles: z.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  gallons: z.number().optional(),
  location: z.string().optional(),
});
export const LogSchema = z.array(LogEntry);
export type LogEntryType = z.infer<typeof LogEntry>;

/**
 * Flow that parses freeform text into structured log entries and RETURNS them.
 * It does NOT perform any database writes — the caller (server API) is responsible for persistence.
 */
export const logEntryFlow = defineFlow(
  {
    name: 'logEntryFlow',
    inputSchema: z.string(),
    outputSchema: LogSchema,
  },
  async (rawText: string) => {
    if (!rawText || rawText.trim() === '') return [];

    const prompt = [
      'You are a strict JSON parser. Parse the following user-provided text into a JSON array of objects.',
      'Return ONLY the JSON array — no prose, no explanations, and no extra fields.',
      'Each object must match this schema:',
      '- type: one of "trip", "fuel", "maintenance" (required)',
      '- miles: number (optional, for trip records)',
      '- from: string (optional)',
      '- to: string (optional)',
      '- gallons: number (optional, for fuel records)',
      '- location: string (optional)',
      '',
      'Example valid output (exact format required):',
      '[{"type":"trip","miles":12.5,"from":"Home","to":"Office"},{"type":"fuel","gallons":10.2,"location":"Shell"}]',
      '',
      'Now parse this input text exactly as described:',
      `"""${rawText}"""`,
    ].join('\n');

    try {
      const result = await gemini15Flash.generate({
        prompt,
        output: { schema: LogSchema },
      });

      const rawOutput = result.output ?? [];

      const parsed = LogSchema.safeParse(rawOutput);
      if (!parsed.success) {
        const errMsg = parsed.error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join('; ');
        throw new Error(`Model output failed schema validation: ${errMsg}`);
      }

      return parsed.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error parsing logs';
      console.error('logEntryFlow error:', err);
      throw new Error(`Failed to parse log entries: ${msg}`);
    }
  }
);