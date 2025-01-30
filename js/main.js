(() => { 


    const cardList = document.createElement('ul');
    const container = document.querySelector('.container');
    const resetButton = document.createElement('button');
    const buttonWrapper = document.createElement('div');
    const form = document.createElement('form');
    const heightInput = document.createElement('input');
    const widthInput = document.createElement('input');
    const startButton = document.createElement('button');
    const span = document.createElement('span');
    const customTimeInput = document.createElement('input');
    const appTitle = document.createElement('h1')
    const appWrapper = document.createElement('div');
    const timerSelect = document.createElement('select'); 
    const timeOptions = [
        { label: 'Standard', value: 0 }, 
        { label: 'Keine Begrenzung', value: 1 }, 
        { label: 'Geben Sie die Zeit ein', value: 2 }, 
    ];
    const timerSpan = document.createElement('span');
    const popupElement = document.createElement('p');
    let gameTimerId = null; 

    function resetGame() {
        clearTimeout(gameTimerId); 
        gameTimerId = null; 
        cardList.innerHTML = '';
        buttonWrapper.remove();
        createStartForm();
    }

    function createArr(width = 4, height = 4) { 
        if (width < 2 || width % 2 !== 0 || width > 10) width = 4;
        if (height < 2 || height % 2 !== 0 || height > 10) height = 4;
        let arrCard = [1, 1];
        for (let i = 0; i <= (width * height) - 3; ++i) {
            if (arrCard[i] === arrCard[i + 1]) {
                arrCard.push(arrCard[i] + 1);
            } else {
                arrCard.push(arrCard[i + 1]);
            };
        };
        return arrCard;
    }

    function mixArr(arr) { 
        let j, temp;
        for (let i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }

        return arr;
    }

    function showPopup(text) {
        popupElement.classList.add('popup');
        popupElement.textContent = text;
        document.body.append(popupElement);

        popupElement.style.display = 'block';

        setTimeout(() => {
            popupElement.classList.add('hide');
        }, 2000);

        setTimeout(() => {
            popupElement.style.display = 'none';
            popupElement.classList.remove('hide');
        }, 3000);
    }

    function customTimer() {

        let value = parseInt(customTimeInput.value);

        let valueTime = value * 1000;

        showPopup(`Sie haben ${value} Sekunden `);

        gameTimerId = setTimeout(() => {
            showPopup(`Die Zeit ist abgelaufen`);
            cardList.innerHTML = '';
            buttonWrapper.remove();
            cardData = [];
            twoCards = [];
            doneCard = [];
            resetGame();
        }, valueTime);

    }

    function timer(selectedValue = '0') {
        if (selectedValue === '0') {
            showPopup('Du hast eine Minute');
            gameTimerId = setTimeout(() => {
                showPopup(`Die Zeit ist abgelaufen`);
                cardList.innerHTML = '';
                buttonWrapper.remove();
                cardData = [];
                twoCards = [];
                doneCard = [];
                resetGame();
            }, 60000)
        } else if (selectedValue === '1') {
            showPopup(`Die Zeit ist nicht begrenzt`);
        } else if (selectedValue === '2') {
            customTimer();
        }
    }


    function createStartForm() {
        container.innerHTML = '';
        timerSelect.innerHTML = '';
        heightInput.value = '';
        widthInput.value = '';
        customTimeInput.remove();

        let selectedTimer;
        appTitle.textContent = 'Paarspiel';
        startButton.textContent = 'Spiel starten'
        span.textContent = 'Es sind nur gerade Zahlen von 2 bis 10 gültig'
        timerSpan.textContent = 'Timer:';

        // назначение классов
        form.classList.add('flex', 'form-start');
        startButton.classList.add('btn-reset', 'button-start');
        heightInput.classList.add('form-input');
        widthInput.classList.add('form-input');
        timerSelect.classList.add('form-input');

        timeOptions.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            timerSelect.append(optionElement);
        });


        // Timer

        customTimeInput.addEventListener('input', () => {
            let value = parseInt(customTimeInput.value);

            if (value < 10) {
                showPopup('Ungültiger Wert');
                startButton.disabled = true;
            }

            if (value >= 10) startButton.disabled = false;
        });

        timerSelect.addEventListener('change', (event) => {
            selectedTimer = event.target.value;

            if (selectedTimer === '0' || selectedTimer === '1') {
                if (document.body.contains(customTimeInput)) customTimeInput.remove();
            }

            if (selectedTimer === '2') {
                customTimeInput.setAttribute('type', 'number');
                customTimeInput.classList.add('form-input');
                customTimeInput.placeholder = 'Geben Sie die Zeit in Sekunden ein, nicht weniger als 10';
                customTimeInput.value = '10';

                timerSelect.after(customTimeInput);
            };
        })


        //ввод только чисел
        heightInput.setAttribute('type', 'number');
        widthInput.setAttribute('type', 'number');


        appWrapper.classList.add('app-wrapper');
        appWrapper.append(appTitle);
        container.append(appWrapper);
        form.append(heightInput);
        form.append(widthInput);
        form.append(span);
        form.append(timerSpan);
        form.append(timerSelect);
        form.append(startButton);

        heightInput.placeholder = 'Geben Sie die Anzahl der Karten vertikal ein';
        widthInput.placeholder = 'Geben Sie die Anzahl der Karten horizontal ein';



        startButton.addEventListener('click', () => {

            cardList.innerHTML = '';
            buttonWrapper.remove();


            let personalWidth = parseInt(widthInput.value, 10) || 4;
            let personalHeight = parseInt(heightInput.value, 10) || 4;

            let personalCardArr = createArr(personalWidth, personalHeight);


            container.innerHTML = '';

            createCardList(personalCardArr, personalWidth)
            timer(selectedTimer);

        })

        container.append(form);



        return {
            form,
            heightInput,
            widthInput,
            startButton,
            span,
        }

    }

    function createCardList(arrCard = createArr(), count = 4) {
        let cardData = [];
        let twoCards = [];
        let doneCard = [];
        let mixedArr = mixArr(arrCard);
        buttonWrapper.classList.add('button-wrapper');
        resetButton.classList.add('btn-reset', 'btn');
        resetButton.textContent = 'Spielen Sie noch einmal';
        buttonWrapper.append(resetButton);
        container.append(cardList);

        //считаем ширину контейнера
        let containerWidth = container.offsetWidth;

        if (count < 2 || count % 2 !== 0 || count > 10) count = 4;

        let cardWidth = ((containerWidth - 50) - ((count - 1) * 25)) / count;

        cardList.classList.add('list-reset', 'flex', 'card-list')


        for (let i = 0; i < mixedArr.length; ++i) {

            let cardElemet = document.createElement('li');

            cardElemet.style.setProperty('width', `${cardWidth}px`, 'important');
            cardElemet.style.setProperty('height', `${cardWidth}px`, 'important');
            cardData.push({ open: false, value: mixedArr[i], });

            cardElemet.setAttribute('data-id', i);
            let itemId = parseInt(cardElemet.getAttribute('data-id'), 10);

            cardElemet.classList.add('list-item', 'card-close');

            cardElemet.addEventListener('click', () => {
                if (cardData[itemId].open) return;


                cardElemet.classList.toggle('card-close');
                if (!cardElemet.classList.contains('card-close')) {
                    cardElemet.textContent = mixedArr[i];
                } else {
                    cardElemet.textContent = '';
                }
                twoCards.push(cardData[itemId]);
                if (twoCards.length === 2) {
                    let index1 = cardData.indexOf(twoCards[0]);
                    let index2 = cardData.indexOf(twoCards[1]);
                    if (twoCards[0].value === twoCards[1].value && index1 !== index2) {
                        doneCard.push(twoCards[0], twoCards[1]);
                        cardData[index1].open = true;
                        cardData[index2].open = true;
                        twoCards = [];
                        let show = [
                            "Super! Du hast es erraten!",
                            "Hervorragend! Das war großartig!",
                            "Du bist spitze! Gut gemacht!",
                            "Bravo! Wundervoll!",
                            "Fantastisch! Du hast es geschafft!",
                            "Na, das war perfekt!",
                            "Du bist einfach ein Genie!",
                            "Tolle Arbeit! Dein Glück ist auf deiner Seite!",
                            "Super! Du hast dich nicht geirrt!",
                            "Wie großartig! Alles richtig!",
                            "Wunderbar! Du hast genau ins Schwarze getroffen!",
                            "Du hattest wirklich Glück! Großartig gespielt!",
                            "Das war auf höchstem Niveau!",
                            "Weiter so! Alles korrekt!",
                            "Beeindruckend! Du bist auf dem richtigen Weg!"
                        ];
                        let randomIndex = Math.floor(Math.random() * show.length);
                        showPopup(show[randomIndex]);
                    } else { //если не угадали
                        let foundCardElement1 = document.querySelector(`[data-id="${index1}"]`);
                        let foundCardElement2 = document.querySelector(`[data-id="${index2}"]`);

                        setTimeout(() => {
                            twoCards = [];
                            foundCardElement1.classList.add('card-close');
                            foundCardElement1.textContent = '';
                            foundCardElement2.classList.add('card-close');
                            foundCardElement2.textContent = '';
                            cardData[index1].open = false;
                            cardData[index2].open = false;
                        }, 300)
                    }
                };

                if (doneCard.length === arrCard.length) {
                    clearTimeout(gameTimerId);
                    showPopup('Победа! Ещё раз?');
                    container.append(buttonWrapper);
                };
            });

            cardList.append(cardElemet);
        }


        return {
            cardList,
            resetButton,
            cardData,
        };



    }

    document.addEventListener('DOMContentLoaded', () => {
        createStartForm();
        resetButton.addEventListener('click', () => {
            cardList.innerHTML = '';
            buttonWrapper.remove();

            cardData = [];
            twoCards = [];
            doneCard = [];

            createStartForm();
        });


    });

})();


