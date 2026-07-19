class WorkletProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input.length > 0) {
            const data = input[0];
            this.port.postMessage(data);
        }
        return true;
    }
}
registerProcessor('worklet-processor', WorkletProcessor);
