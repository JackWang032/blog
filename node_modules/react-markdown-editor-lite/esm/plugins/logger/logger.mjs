const MAX_LOG_SIZE = 100;
class Logger {
    record = [];
    recycle = [];
    maxSize;
    initValue = '';
    constructor(props = {}){
        const { maxSize = MAX_LOG_SIZE } = props;
        this.maxSize = maxSize;
    }
    push(val) {
        const result = this.record.push(val);
        while(this.record.length > this.maxSize)this.record.shift();
        return result;
    }
    get() {
        return this.record;
    }
    getLast() {
        const { length } = this.record;
        return this.record[length - 1];
    }
    undo(skipText) {
        const current = this.record.pop();
        if (void 0 === current) return this.initValue;
        if (current !== skipText) {
            this.recycle.push(current);
            return current;
        }
        const last = this.record.pop();
        if (void 0 === last) {
            this.recycle.push(current);
            return this.initValue;
        }
        this.recycle.push(current);
        return last;
    }
    redo() {
        const history = this.recycle.pop();
        if (void 0 !== history) {
            this.push(history);
            return history;
        }
    }
    cleanRedo() {
        this.recycle = [];
    }
    getUndoCount() {
        return this.undo.length;
    }
    getRedoCount() {
        return this.recycle.length;
    }
}
const logger = Logger;
export { logger as default };
