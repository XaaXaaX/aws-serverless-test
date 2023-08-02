export class JestAdapter {
    static SetTimeOut() {
        jest.setTimeout(120000);
    }

    static DeepClone<T>(object: T): T {
        return JSON.parse(JSON.stringify(object)) as T;
    }
}