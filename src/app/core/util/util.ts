import { Subject } from 'rxjs';

export const removeEmptyKey = (object: any) => {
  Object.keys(object).forEach(k => {
    if (object[k] === undefined || object[k] === null) {
      delete object[k];
    }
  });
  return object;
};

export const isNullOrUndefined = (v: number | undefined | null) => {
  return v === undefined || v === null;
};

export const msToHHMMSS = (ms: number) => {
  const sec = Math.round(ms / 1000);
  const date = new Date(null);
  date.setSeconds(sec);
  return sec >= 60 * 60 ?
    date.toISOString().substr(11, 8) :
    date.toISOString().substr(14, 5);
};

export const isString = (v: any): v is string => {
  return typeof v === 'string' || v instanceof String;
};

const windowResizeEvent = new Subject<Event>();
window.addEventListener('resize', windowResizeEvent.next.bind(windowResizeEvent));

export const onResize = () => windowResizeEvent.asObservable();
