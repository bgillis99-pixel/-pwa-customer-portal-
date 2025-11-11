import { defineFlow } from '@genkit-ai/core';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LogSchema = z.array(
  z.object({
    type: z.enum(['trip', 'fuel', 'maintenance']),
    miles: z.number().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    gallons: z.number().optional(),
    location: z.string().optional(),
  })
);

export const logEntryFlow = defineFlow(
  {
    name: 'logEntryFlow',
    inputSchema: z.string(),
    outputSchema: LogSchema,
  },
  async (rawText) => {
    const result = await gemini15Flash.generate({
      prompt: `Parse this into structured logs: "${rawText}"`,
      output: { schema: LogSchema },
    });

    const entries = result.output;

    // Save each entry to Firestore
    for (const entry of entries) {
      await addDoc(collection(db, 'logs'), {
        ...entry,
        raw: rawText,
        createdAt: serverTimestamp(),
      });
    }

    return entries;
  }
);
