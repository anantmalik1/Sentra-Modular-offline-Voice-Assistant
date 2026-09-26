'use client';

import { TimelineTask } from '@/types/dashboard';

export interface CommandExecutionResult {
  handled: boolean;
  actionText: string;
  feedbackTitle: string;
  feedbackDesc: string;
  tag: 'LIVE' | 'INFO' | 'WARN';
}

export interface CommandContext {
  createTask: (title: string, time: string, priority: string) => Promise<boolean>;
  tasks: TimelineTask[];
}

// Helper: Check if running inside Electron environment
function getElectronAPI(): any {
  if (typeof window !== 'undefined' && (window as any).electronAPI) {
    return (window as any).electronAPI;
  }
  return null;
}

// Helper: resolve contact name or return raw phone
async function resolvePhone(target: string): Promise<{ phone: string | null; name: string }> {
  const cleanTarget = target.trim();
  // Check if target is already a phone number (e.g. +919876543210 or digits)
  const isPhone = /^(\+?\d{7,15})$/.test(cleanTarget.replace(/[\s-]/g, ''));
  if (isPhone) {
    return { phone: cleanTarget.replace(/[\s-]/g, ''), name: cleanTarget };
  }

  // Lookup in contacts database
  try {
    const res = await fetch(`/api/contacts?name=${encodeURIComponent(cleanTarget)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.contact && data.contact.phone) {
        return { phone: data.contact.phone, name: data.contact.name };
      }
    }
  } catch (e) {
    console.warn('[CommandParser] Contact lookup failed:', e);
  }

  return { phone: null, name: cleanTarget };
}

export async function executeVoiceOrWebCommand(
  rawText: string,
  context: CommandContext
): Promise<CommandExecutionResult> {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const electron = getElectronAPI();

  // 1. "open [app name]" or "open [website name]"
  const openMatch = lower.match(/^open\s+([a-z0-9.-]+(?:\.[a-z]{2,})?)/i) || lower.match(/^open\s+(.+)/i);
  if (openMatch) {
    const rawTarget = openMatch[1].trim();
    const appKey = rawTarget.toLowerCase().replace(/\s+/g, '');

    // List of known desktop applications
    const desktopApps = [
      'spotify', 'whatsapp', 'chrome', 'googlechrome', 'notepad',
      'calculator', 'calc', 'vscode', 'code', 'terminal', 'powershell',
      'cmd', 'explorer', 'settings', 'paint', 'discord', 'telegram', 'slack'
    ];

    // If running in Electron and targeting an application
    if (electron && desktopApps.includes(appKey)) {
      try {
        const res = await electron.openApp(rawTarget);
        return {
          handled: true,
          actionText: `Launched desktop application: ${rawTarget}`,
          feedbackTitle: `OS Native Execution: ${rawTarget.toUpperCase()}`,
          feedbackDesc: res?.message || `Launched native Windows process for '${rawTarget}'`,
          tag: 'LIVE',
        };
      } catch (err: any) {
        return {
          handled: true,
          actionText: `Failed to open ${rawTarget}`,
          feedbackTitle: `Application Launch Error`,
          feedbackDesc: `Could not launch '${rawTarget}': ${err.message}`,
          tag: 'WARN',
        };
      }
    }

    // Otherwise, treat as website
    let url = '';
    const wellKnown: Record<string, string> = {
      youtube: 'https://www.youtube.com',
      google: 'https://www.google.com',
      github: 'https://www.github.com',
      reddit: 'https://www.reddit.com',
      twitter: 'https://twitter.com',
      x: 'https://x.com',
      chatgpt: 'https://chat.openai.com',
      wikipedia: 'https://www.wikipedia.org',
      whatsapp: 'https://web.whatsapp.com',
      spotify: 'https://open.spotify.com',
      amazon: 'https://www.amazon.com',
      netflix: 'https://www.netflix.com',
    };

    if (wellKnown[rawTarget]) {
      url = wellKnown[rawTarget];
    } else if (rawTarget.includes('.')) {
      url = rawTarget.startsWith('http') ? rawTarget : `https://${rawTarget}`;
    } else {
      url = `https://www.${rawTarget}.com`;
    }

    if (electron) {
      await electron.openWebsite(url);
    } else {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch {}
    }

    return {
      handled: true,
      actionText: `Opened ${url}`,
      feedbackTitle: `Browser Dispatch: ${rawTarget.toUpperCase()}`,
      feedbackDesc: `Navigated to target portal: ${url}`,
      tag: 'LIVE',
    };
  }

  // 2. "play [song name]"
  const playMatch = lower.match(/^play\s+(.+)/i);
  if (playMatch) {
    const songName = playMatch[1].trim();
    if (electron) {
      await electron.playSong(songName);
    } else {
      const queryUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(songName)}`;
      try {
        window.open(queryUrl, '_blank', 'noopener,noreferrer');
      } catch {}
    }

    return {
      handled: true,
      actionText: `Playing '${songName}' on YouTube`,
      feedbackTitle: `Audio Directive Dispatched`,
      feedbackDesc: `Now playing '${songName}' on YouTube`,
      tag: 'LIVE',
    };
  }

  // 3. "search for [x]" or "google [x]"
  const searchMatch = lower.match(/^(?:search(?:\s+for)?|google)\s+(.+)/i);
  if (searchMatch) {
    const query = searchMatch[1].trim();
    const queryUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    if (electron) {
      await electron.openWebsite(queryUrl);
    } else {
      try {
        window.open(queryUrl, '_blank', 'noopener,noreferrer');
      } catch {}
    }

    return {
      handled: true,
      actionText: `Searched for '${query}'`,
      feedbackTitle: `Web Query Dispatched`,
      feedbackDesc: `Google Search initiated for "${query}"`,
      tag: 'LIVE',
    };
  }

  // 4. "send whatsapp message to [contact/phone] saying [message]"
  const waMatch = lower.match(/send\s+whatsapp(?:\s+message)?\s+to\s+(.+?)\s+saying\s+(.+)/i) ||
                  lower.match(/whatsapp\s+(?:message\s+to\s+)?(.+?)\s+saying\s+(.+)/i);

  if (waMatch) {
    const targetContact = waMatch[1].trim();
    const message = waMatch[2].trim();

    const { phone, name } = await resolvePhone(targetContact);

    if (electron) {
      if (phone) {
        const res = await electron.sendWhatsApp(phone, message);
        return {
          handled: true,
          actionText: `WhatsApp message queued for ${name}`,
          feedbackTitle: `WhatsApp Automation Initiated`,
          feedbackDesc: `WhatsApp message dispatched to ${name} (${phone}): "${message}"`,
          tag: 'LIVE',
        };
      } else {
        return {
          handled: true,
          actionText: `Contact '${targetContact}' not found`,
          feedbackTitle: `Contact Lookup Failed`,
          feedbackDesc: `Contact "${targetContact}" not found in your database. Please provide a phone number (+91...) or add this contact first.`,
          tag: 'WARN',
        };
      }
    } else {
      // Browser fallback (wa.me)
      const waUrl = phone
        ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch {}

      return {
        handled: true,
        actionText: `Opened WhatsApp with pre-filled message`,
        feedbackTitle: `WhatsApp Web Portal Activated`,
        feedbackDesc: `Pre-filled message: "${message}". Select contact in browser to transmit.`,
        tag: 'LIVE',
      };
    }
  }

  // 5. "create a task [task name]"
  const taskMatch = lower.match(/^(?:create(?:\s+a)?\s+task|add(?:\s+a)?\s+task)\s+(.+)/i);
  if (taskMatch) {
    const taskName = taskMatch[1].trim();
    const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    await context.createTask(taskName, timeFormatted, 'Normal');

    return {
      handled: true,
      actionText: `Created task: ${taskName}`,
      feedbackTitle: `Task Registered: "${taskName}"`,
      feedbackDesc: `Scheduled for ${timeFormatted} with Normal priority`,
      tag: 'LIVE',
    };
  }

  // 6. "what's on my calendar" or "check schedule"
  if (
    lower.includes("what's on my calendar") ||
    lower.includes("what is on my calendar") ||
    lower.includes("check calendar") ||
    lower.includes("check schedule")
  ) {
    const count = context.tasks.length;
    const taskList = context.tasks.slice(0, 3).map((t) => t.title).join(', ');
    const desc = count === 0
      ? 'No mission tasks scheduled for today.'
      : `${count} item(s) on schedule today: ${taskList}`;

    return {
      handled: true,
      actionText: `Calendar status: ${count} tasks`,
      feedbackTitle: `Strategic Calendar Briefing`,
      feedbackDesc: desc,
      tag: 'INFO',
    };
  }

  // Fallback if not matching explicit pattern
  return {
    handled: false,
    actionText: `Unrecognized directive: "${text}"`,
    feedbackTitle: `Directive Not Recognized`,
    feedbackDesc: `Command not recognized — try "open [app/site]", "play [song]", "search for [x]", "send whatsapp to [contact] saying [msg]", or "create task [name]"`,
    tag: 'WARN',
  };
}
