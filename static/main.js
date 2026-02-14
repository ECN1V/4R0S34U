class ROSE {
    constructor() {
        this.asciiContainer = document.getElementById("flower");
        this.textElement = document.querySelector(".text");
        this.proposalElement = document.getElementById("proposal")

        this.keyAudio = new Audio('static/audio/key.mp3');
        this.spaceAudio = new Audio('static/audio/spacebar.mp3');

        this.characters = '.!@#$1234567890%&ILY;:';
        this.rendering = false;
        this.frame = [];

        this.fillInterval = 2;
        this.glitchInterval = 120;
        this.glitchIntensity = 0.03;

        this.introduction();
        this.art = `////////////////////////////////////////////~~~~////////////////////////////////////////////////////
        ///////////////////////////////////////~~~~~~~~~~~~~////////////////////////////////////////////////
        /////////////////////////////////////~~~~~~~~~~~~~~~~~~~~~~/////~~~~///////~~~~~~~~~~///////////////
        //////////////////////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~//~~~~~~~~~~~~~~~~////////////
        //////////////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//////////
        ////////////////////////~~~~~~~~~~~~~~~~~~~~~~~////~~~~~~//~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~/////////
        //////////////////////~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~/~~~~~~~~~~//~~~~~~~~~~~~~~~~~~/////////
        ////////////////////~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~/~~~~~~~~~/~~~~~~///~//~~~~~~~////////
        ///////////////////~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~/~~~///~~~~//~~~~~~////////
        ///////////////////~~~~~~~~~~~~~~~~///~~~~~~~~~~//////////~~~~~~//~~~~~~~~~~//~~~~~~//~~~~~~////////
        //////////////////~~~~~~~~~~~~~~~////~~~~~~///~~~~~~~/~~~~~/~~~~~~/~~~~~~//~~~~~~~~~/~~~~~~~////////
        //////////////////~~~~~~~~~~/////~//~~~~//~~~~~~~~~~/~~~~~~//~~~~~~/~~~~~/~~~~~~~~~//~~~~~~/////////
        /////////////////~~~~~~~////~~~~~///~~/~~~~//////~~/~~~~~~~~/~~~~~~//~~~~~//~~~~~~~/~~~~~~~/////////
        ////////////////~~~~~~~//~~~~~~~////~/~~~~~~~~//~//~~~~~~~~~//~~~~~//~~~~~//~~~~~~/~~~~~~~~/////////
        ///////////////~~~~~~///~~~~~~~//~~~~~~~//////~~//~~~~~~~~~~~/~~~~~//~~~~~//~~~~~/~~~~~~~~~/////////
        //////////////~~~~~//~~~~~~~~~~/~~~~~~~~~~~~~///~~~~~~~~~~~~~//~~~~//~~~~//~~~~~//~~~~~~~~~~////////
        //////////////~~~~~/~~~~~~~~~~//~~~~~~~~~~~///~~~~~~~~~~~~~~~~/~~~~/~~~//~~~~~~//~~~~~~~~~~~~///////
        //////////////~~~~//~~~~~~~~~~//~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~/~~~/~~//~~~~~~~//~~~~~~~~~~~~~//////
        ////////////~//~~~//~~~~~~~~~~//~~~~~~~///~~~~~~~/////////~~~~~~/~~/~/~~~~~~~~~/~~~~~~~~~~~~~~~/////
        ///////////~~//~~~//~~~~~~~~~~//~~~~///~~~~/////~~~~~~~~////~~~~~~~//~~~~~~~~~~/~~~~~~~~~~~~~~~/////
        //////////~~~~/~~~~//~~~~~~~~~//~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~/~~~~~~~~~~~~~~~/////
        /////////~~~~~//~~//~~~~~~~~~///~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~/~~~~~~~~~~~~~~~/////
        /////////~~~~~~//~//~~~~~~~~~~//~//~~~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~/////
        /////////~~~~~~~~///~~~~~~~~~~//~/~~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~/////
        /////////~~~~~~~~~~///~~~~~~~~////~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~//////~~~~/~~~~~~~~~~~~~~~~////
        //////////~~~~~~~~~~~~~/////////~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~////~~~~~///~/~~~~~~~~~~~~~~~~////
        ////////~~/~~~~~~~~~~~~~~~~~~///////~~~~~~~~~~~~~~~~~~///~~~~~////~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~////
        ////////~//~~~~~~~~~~~~~~~~~~~~~~~~~~////////~~~~~~~~///~~////~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~////
        ///////~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/////~~~////~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~/////
        ///////~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~////~~~~~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~///////
        ///////~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//////~~~~~~~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~/////////
        ///////~~~/~~~~~~~~~~~~~~~~~~~~~~~~~~~~/////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~//////////
        ///////~~~////~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~///////////
        ///////~~~~~///////////////////~/////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~///////////
        //////~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~////////////
        ///////~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~~////////////
        ////////~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~~~~~~/////////////
        ///////////~~~~~~~~~~~~~~~~~//~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~////~~~~~~~~~~~~~~~~~~~//////////////
        /////////////~~~~~~~~~~~~~~///~~~~~~////~~~/////~~~~~~~~~////~~~~~/~~~~~~~~~~~~~~~~~~///////////////
        //////////////~~~~~~~~~~~~~~///////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~///~~~~~~~~~~~~~/////////////////
        //////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//////~~~////////////////////////
        //////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/////////////////////////////////
        ///////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//////////////////////////////////
        //////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/////////////////////////////////////
        ///////////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~///////////////////////////////////////
        ///////////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~////////////////////////////////////////
        ////////////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//////////////////////////////////////////
        //////////////////////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~///////////////////////////////////////////
        /////////////////////////////~~~~~~~~~~~~~~~////////~~//////////////////////////////////////////////
        ///////////////////////////////////~~~~`;
    }

    playSound(sound) {
        try { sound.currentTime = 0; sound.play().catch(()=>{}); } catch (e) {}
    }

    toCharGrid(input) {
        return input.replace(/\r\n/g, '\n').split('\n').map(line => Array.from(line));
    }

    introduction() {
        const data = "click anywhere <3";
        let i = 0;
        const step = () => {
            if (i < data.length) {
                const ch = data.charAt(i++);
                if (ch === ' ') this.playSound(this.spaceAudio);
                else this.playSound(this.keyAudio);
                if (this.textElement) this.textElement.textContent += ch;
                setTimeout(step, 80 + Math.random() * 80);
            } else {
                document.addEventListener('click', () => this.onClick(), { once: true });
            }
        };
        step();
    }

    destroyText() {
        if (this.textElement && this.textElement.parentNode) {
            this.textElement.parentNode.removeChild(this.textElement);
            this.textElement = null;
        }
    }

    async requestFlower(name) {
        return toCharGrid(this.art)
    }
        
    getRandomChar() {
        return this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }

    clearContainer() {
        if (!this.asciiContainer) return;
        while (this.asciiContainer.firstChild) this.asciiContainer.removeChild(this.asciiContainer.firstChild);
    }

    loadAscii(buffer) {
        if (!this.asciiContainer) return;
        this.clearContainer();
        this.frame = [];

        const frag = document.createDocumentFragment();
        for (let r = 0; r < buffer.length; r++) {
            const row = buffer[r];
            const div = document.createElement('div');
            div.className = 'flower_row';
            // compact vertical spacing
            div.style.lineHeight = '1';
            div.style.margin = '0';
            div.style.padding = '0';
            div.textContent = ' '.repeat(row.length);
            frag.appendChild(div);

            const frameRow = new Array(row.length);
            for (let c = 0; c < row.length; c++) {
                const ch = row[c];
                if (ch === '/') frameRow[c] = { ch: ' ', type: 0 };
                else if (ch === '~') frameRow[c] = { ch: ' ', type: 1 };
                else frameRow[c] = { ch: String(ch), type: 2 };
            }
            this.frame.push(frameRow);
        }
        this.asciiContainer.appendChild(frag);
    }

    async animateAsciiArt() {
        const positions = [];
        for (let r = 0; r < this.frame.length; r++) {
            for (let c = 0; c < this.frame[r].length; c++) {
                if (this.frame[r][c].type === 1) positions.push({ r, c });
            }
        }

        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        const rowStrings = this.frame.map(row => row.map(cell => cell.ch).join(''));
        const rowsToUpdate = new Set();

        for (let i = 0; i < positions.length; i++) {
            const { r, c } = positions[i];
            const ch = this.getRandomChar();
            this.frame[r][c].ch = ch;
            this.frame[r][c].type = 2;
            rowStrings[r] = rowStrings[r].slice(0, c) + ch + rowStrings[r].slice(c + 1);
            rowsToUpdate.add(r);

            if ((i % 6) === 0 || i === positions.length - 1) {
                for (const rr of rowsToUpdate) {
                    const div = this.asciiContainer.children[rr];
                    if (div) div.textContent = rowStrings[rr];
                }
                rowsToUpdate.clear();
            }

            await new Promise(res => setTimeout(res, this.fillInterval));
        }

        for (let r = 0; r < rowStrings.length; r++) {
            const div = this.asciiContainer.children[r];
            if (div) div.textContent = rowStrings[r];
        }
    }

    startGlitchLoop() {
        this.stopGlitchLoop();

        this._editable = [];
        for (let r = 0; r < this.frame.length; r++) {
            for (let c = 0; c < this.frame[r].length; c++) {
                const cell = this.frame[r][c];
                if (cell.type === 2 && cell.ch !== ' ') this._editable.push({ r, c });
            }
        }
        if (!this._editable.length) return;

        const tick = () => {
            const editable = this._editable;
            const count = Math.max(1, Math.floor(editable.length * this.glitchIntensity));
            const chosen = new Set();
            while (chosen.size < count) chosen.add(Math.floor(Math.random() * editable.length));

            const touched = new Set();
            chosen.forEach(i => {
                const { r, c } = editable[i];
                this.frame[r][c].ch = this.getRandomChar();
                touched.add(r);
            });

            touched.forEach(r => {
                const div = this.asciiContainer.children[r];
                if (!div) return;
                const rowArr = this.frame[r];
                let s = '';
                for (let k = 0; k < rowArr.length; k++) s += rowArr[k].ch;
                div.textContent = s;
            });

            this._glitchTimer = setTimeout(tick, this.glitchInterval);
        };

        this._glitchTimer = setTimeout(tick, this.glitchInterval);
    }

    stopGlitchLoop() {
        if (this._glitchTimer) {
            clearTimeout(this._glitchTimer);
            this._glitchTimer = null;
        }
    }

    proposal() {
        const data = "will you be my valentine?";
        if (!this.proposalElement) return;
        this.proposalElement.textContent = '';
        this.proposalElement.setAttribute('aria-hidden','false');
        this.proposalElement.style.opacity = '0';
        this.proposalElement.style.setProperty('--cursor-animation', 'none');

        let i = 0;
        const step = () => {
        if (i < data.length) {
            const ch = data.charAt(i++);
            if (ch === ' ') this.playSound(this.spaceAudio);
            else this.playSound(this.keyAudio);

            if (i === 1) {
            this.proposalElement.style.opacity = '1';
            this.proposalElement.style.setProperty('--cursor-animation', 'blink 0.8s infinite');
            }

            this.proposalElement.textContent += ch;
            setTimeout(step, 80 + Math.random() * 80);
        }
        };
        step();
    }


    async renderFlower(name) {
        if (this.rendering) return;
        this.rendering = true;
        try {
            const data = await this.requestFlower(name);
            this.loadAscii(data);
            await this.animateAsciiArt();
            this.startGlitchLoop();
            this.proposal(); //here because yes
        } catch (e) {
        } finally {
            this.rendering = false;
        }
    }

    onClick() {
        this.destroyText();
        this.renderFlower("rose");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ROSE();
});
