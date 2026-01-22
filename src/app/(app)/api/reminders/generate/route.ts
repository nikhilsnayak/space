import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { Result } from 'better-result';
import z from 'zod';

import { getSession } from '~/lib/auth';

const BASE_PROMPT = `
You generate short, motivating reminder messages during focused work sessions.

Context:

* The user is in **work mode**.
* Reminders appear multiple times per day.
* The current local time is provided as input.
* A list of **recently shown messages (last X hours)** is provided.

Core goals:

* Keep reminders **fresh, practical, and non-repetitive**.
* Encourage **immediate, low-effort actions** (hydrate, stand, stretch, breathe, reset posture).
* Avoid boredom, guilt, hype, or generic motivation.

Time-aware behavior:

* **Morning (5-11):** gentle activation, hydration, posture, focus setup.
* **Midday (11-16):** movement, eye rest, short walk, reset energy.
* **Evening (16-21):** fatigue-aware, lighter prompts, tension release.
* **Late hours:** calm, grounding, optional disengagement cues.

Stateful rules:

* Do **not** repeat or closely paraphrase any message used in the last N messages.
* Vary verbs, structure, and phrasing across messages.
* If novelty is low, shift the action type (e.g., from hydration → movement).

Style rules:

* 1-2 short sentences.
* Clear, direct, neutral tone.
* No emojis.
* No lists, no explanations.
* At most one exclamation mark (prefer none).

Previous N messages:
<previous_messages>
$$PREVIOUS_MESSAGES$$
</previous_messages>

Current time:
<current_time>
$$CURRENT_TIME$$
</current_time>
`;

const RequestSchema = z.object({
  currentTime: z.string(),
  previousMessages: z.array(z.string()),
});

const MessageObject = Output.object({
  schema: z.object({
    title: z.string(),
    body: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await Result.gen(async function* () {
    const body = yield* Result.await(Result.tryPromise(() => request.json()));

    const { previousMessages, currentTime } = yield* Result.try(() => {
      return RequestSchema.parse(body);
    });

    const prompt = BASE_PROMPT.replace(
      '$$PREVIOUS_MESSAGES$$',
      JSON.stringify(previousMessages, null, 2)
    ).replace('$$CURRENT_TIME$$', currentTime);

    const message = yield* Result.await(
      Result.tryPromise(async () => {
        const { output } = await generateText({
          prompt,
          model: google('gemini-2.5-flash'),
          output: MessageObject,
        });
        return output;
      })
    );

    return Result.ok(message);
  });

  if (result.isErr()) {
    console.error(result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ message: result.value });
}
