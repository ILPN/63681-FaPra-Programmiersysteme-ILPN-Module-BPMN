export class Random{

    /**
     * generates random ID of random length 
     * @returns 
     */
    public static id(): string{
        let randomLength = this.getRandomLength(2)
        let randomBase = this.getRandomBase()
        return (Math.random() + 1).toString(randomBase).substring(2 + randomLength);
    }

    private static getRandomLength(max: number) {
        return 1 + Math.floor(Math.random() * max);
    }

    private static getRandomBase(){
        return 36 - this.getRandomLength(10)
    }
}