import * as path from 'path';
import * as open from 'open';
import * as open_darwin from 'mac-open';

// decide what os should be used
// possible node values 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
const platform = process.platform;

// common function for file opening
export function openUrl(e: string) {
  if (platform === 'darwin') {
    return open_darwin(e);
  }
  return open(e);
}