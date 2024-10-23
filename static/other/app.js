document.addEventListener("DOMContentLoaded", () => {
    app.animateTitle();
    app.setVideoVolume();
});

class App {
    data = {
        options: {
            title: {
                text: "",
                fullText: null,
                textArray: [],
                currentIndex: 0,
                interval: null,
                reverse: false,
                first: true,
                firstLoop: true
            },
            background: {
                play: false
            }
        }
    }

    constructor(options = {}) {
        Object.assign(this.data.options.title, options);
    }

    animateTitle() {
        if(this.data.options.title.first) {
            this.data.options.title.interval = this.random(2000, 5000);

            this.data.options.title.fullText = this.data.options.title.textArray[0];

            this.data.options.title.text = document.title;
            
            this.data.options.title.first = false;

            this.data.options.title.currentIndex = this.data.options.title.text.length - 1;

            this.animateTitle();

            return;
        }

        setTimeout(() => {   
            const sub = document.getElementById("subtitle");
            
            if(this.data.options.title.text.length > 0 && !this.data.options.title.reverse) {
                this.data.options.title.text = this.data.options.title.text.slice(0, -1);
                sub.textContent = this.data.options.title.text;

                document.title = this.data.options.title.text;

                this.data.options.title.interval = this.random(100, 300);
                
                this.data.options.title.currentIndex--;
            }

            if(this.data.options.title.text.length === 0 && !this.data.options.title.reverse) {
                if(this.data.options.title.firstLoop) {
                    this.data.options.title.fullText = this.data.options.title.textArray[0];

                    this.data.options.title.reverse = true;
                    this.data.options.title.firstLoop = false;
                }
                else {
                    this.data.options.title.fullText = this.data.options.title.textArray[this.random(0, this.data.options.title.textArray.length - 1)];
                    this.data.options.title.reverse = true;
                }

                this.data.options.title.currentIndex = 0;

                this.data.options.title.interval = this.random(2000, 5000);
            }

            if(this.data.options.title.text.length < this.data.options.title.fullText.length && this.data.options.title.reverse) {
                this.data.options.title.text += this.data.options.title.fullText[this.data.options.title.currentIndex];
                sub.textContent = this.data.options.title.text;
                document.title = this.data.options.title.text;

                this.data.options.title.currentIndex++;
                this.data.options.title.interval = this.random(100, 300);
            }

            if(this.data.options.title.text.length === this.data.options.title.fullText.length && this.data.options.title.reverse) {
                this.data.options.title.reverse = false;

                this.data.options.title.interval = this.random(2000, 5000);
            }

            this.animateTitle();

        }, this.data.options.title.interval);
    }

    setVideoVolume() {
        document.getElementById("background-video").load();

        document.addEventListener("click", () => {
            if(!this.data.options.background.play) {
                
                const video = document.getElementById("background-video");
                video.muted = false;
                video.volume = 0.25;
                
                this.data.options.background.play = true;   
            }
        });
    }

    random(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

const app = new App({
    textArray: ["messiah", "owned by messiah", "just spy", "f*cking rust-lang"],
});