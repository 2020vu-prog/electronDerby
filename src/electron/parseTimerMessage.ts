export interface TimerReading {
    lane: string;
    ms: string;
}

const TIMER_MESSAGE_PATTERN = /lane\s*(\d)\s+(\d+\.\d\d\d)/i;

export function parseTimerMessage(msgString: string): TimerReading | null {
    const found = msgString.match(TIMER_MESSAGE_PATTERN);
    if (!found || found.length <= 2) {
        return null;
    }
    return {
        lane: found[1],
        ms: found[2].replace('.', ''),
    };
}
