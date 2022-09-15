const fs = require('fs');

class Container {
    constructor(file) {
        this.file = file;
    }

    async #readFile() {
        try {
            const content = await fs.promises.readFile(this.file, 'utf-8');
            const parsedContent = JSON.parse(content);
            return parsedContent;
        } catch (error) {
            return error;
        }
    }

    async save(obj) {
        try {
            const fileContent = await this.#readFile();
            if (fileContent.length !== 0) {
                await fs.promises.writeFile(this.file, JSON.stringify([...fileContent, {
                    ...obj,
                    id: fileContent[fileContent.length - 1].id + 1
                }], null, 2), 'utf-8');

                return 'Object(s) created.'
            } else {
                await fs.promises.writeFile(this.file, JSON.stringify([{
                    ...obj,
                    id: 0
                }]), 'utf-8');

                return 'Object(s) created.'
            }
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        const fileContent = await this.#readFile();
        const element = fileContent.find(e => e.id === id)
        return element ? element : null;
    }

    async getAll() {
        const fileContent = await this.#readFile();
        return fileContent;
    }

    async deleteById(id) {
        try {
            const fileContent = await this.#readFile();
            const fileCopy = Array.from(fileContent);
            const element = fileCopy.findIndex(obj => obj.id === id);
            if (element >= 0) {
                fileCopy.splice(element, 1);
                await fs.promises.writeFile(this.file, JSON.stringify([...fileCopy], null, 2), 'utf-8');
                return 'Element removed.';
            } else {
                return 'Element not found.';
            }
        } catch (error) {
            return error;
        }
    }

    async deleteAll() {
        try {
            const fileContent = await this.#readFile();
            if (fileContent.length !== 0) {
                await fs.promises.writeFile(this.file, JSON.stringify([]));
                return 'Arrray cleared.'
            } else {
                return 'Array is already empty.';
            }
        } catch (error) {
            return error;
        }
    }
}

const container = new Container('./data.json');

async function call() {
     console.log(await container.save({
        name: 'Coffee',
        price: 2.50
    })); 
    console.log(await container.getById(4)); 
     console.log(await container.getAll()); 
     console.log(await container.deleteById(3)); 
    console.log(await container.deleteAll()); 
}

call();