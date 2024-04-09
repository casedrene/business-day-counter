import { go } from './task1';

main().catch(e => { console.error(e); });

async function main(): Promise<void> {
    await go();
    console.log('Done!');
}