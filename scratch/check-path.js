
import { createDebug } from './src/debugWithMeta.js';

const debug = createDebug('test');
debug('This should show caller info');
