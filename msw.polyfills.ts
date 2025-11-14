// msw.polyfills.ts
import "fast-text-encoding";
import "react-native-url-polyfill/auto";

// Polyfill bem básico de EventTarget
class RNEventTarget {
  addEventListener(_type: string, _listener: any) {
    // no-op
  }

  removeEventListener(_type: string, _listener: any) {
    // no-op
  }

  dispatchEvent(_event: any): boolean {
    // no-op
    return false;
  }
}

// Polyfill básico de Event
class RNEvent {
  type: string;
  target: any;
  currentTarget: any;

  constructor(type: string, eventInitDict?: any) {
    this.type = type;
    this.target = eventInitDict?.target ?? null;
    this.currentTarget = eventInitDict?.currentTarget ?? null;
    Object.assign(this, eventInitDict);
  }
}

// Polyfill básico de MessageEvent
class RNMessageEvent extends RNEvent {
  data: any;

  constructor(type: string, eventInitDict?: any) {
    super(type, eventInitDict);
    this.data = eventInitDict?.data;
  }
}

// Polyfill MUITO simples de BroadcastChannel
class RNBroadcastChannel extends RNEventTarget {
  name: string;
  onmessage: ((event: RNMessageEvent) => void) | null = null;

  constructor(name: string) {
    super();
    this.name = name;
  }

  postMessage(_message: any) {
    // no-op total — msw só precisa que isso exista
  }

  close() {
    // no-op
  }
}

const g = global as any;

// Só define se não existir
if (typeof g.EventTarget === "undefined") {
  g.EventTarget = RNEventTarget;
}

if (typeof g.Event === "undefined") {
  g.Event = RNEvent;
}

if (typeof g.MessageEvent === "undefined") {
  g.MessageEvent = RNMessageEvent;
}

if (typeof g.BroadcastChannel === "undefined") {
  g.BroadcastChannel = RNBroadcastChannel;
}
