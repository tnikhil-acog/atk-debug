
import { createDebug } from '../src/debugWithMeta.ts';

const debug = createDebug('test');
debug('This should show caller info');
