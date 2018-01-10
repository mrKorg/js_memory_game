"use strict";

window.onload = function () {

    let data = {
        items: [],
        imagesArray: [],
        gameHtml: '',
        selected: {
            item_1: {
                id: null,
                str: null
            },
            item_2: {
                id: null,
                str: null
            },
        },
        identified: [],
        api_url: 'https://ec-test-react.herokuapp.com'
    };

    let cartsBox = document.getElementById('carts');
    let resultBox = document.getElementById('result');

    function start() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', data.api_url + '/api/v1/pictures', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                data.items = JSON.parse(xhr.responseText);
                createRandomArray();
                render();
                setAction();
            }
        };
    }

    function compareRandom(a, b) {
        return Math.random() - 0.5;
    }

    function createRandomArray() {
        let randomArr1 = data.items.sort(compareRandom);
        let randomArr2 = data.items.sort(compareRandom);
        data.imagesArray = randomArr1.concat(randomArr2)
    }

    function render() {
        for (let i in data.imagesArray) {
            if (data.imagesArray.hasOwnProperty(i)) {
                data.gameHtml += '<p class="cart" id="cart-' + i + '"><span><img src="' + data.api_url + '/' + data.imagesArray[i] + '" alt=""></span></p>';
            }
        }
        cartsBox.innerHTML = data.gameHtml;
    }

    function setAction() {
        let carts = document.getElementsByClassName('cart');
        for (let i = 0; i < carts.length; i++) {
            if (carts.hasOwnProperty(i)) {
                carts[i].onclick = function () {
                    if (data.selected.item_1.str === null || data.selected.item_2.str === null) {
                        let self = this;
                        self.classList.add('show');
                        let selectedUrl = self.children[0].childNodes[0].getAttribute('src');
                        if (data.selected.item_1.str === null && data.selected.item_2.id !== i) {
                            data.selected.item_1.str = selectedUrl;
                            data.selected.item_1.id = i;
                            setTimeout(function () {
                                self.classList.remove('show');
                                data.selected.item_1 = {
                                    id: null,
                                    str: null
                                };
                            }, 1500);
                        } else if (data.selected.item_2.str === null && data.selected.item_1.id !== i) {
                            data.selected.item_2.str = selectedUrl;
                            data.selected.item_2.id = i;
                            setTimeout(function () {
                                self.classList.remove('show');
                                data.selected.item_2 = {
                                    id: null,
                                    str: null
                                };
                            }, 1500);
                        }
                        if (data.selected.item_1.str !== null && data.selected.item_2.str !== null && data.selected.item_1.str === data.selected.item_2.str) {
                            moveSelected(data.selected.item_1.id, data.selected.item_2.id);
                            data.selected.item_1 = data.selected.item_2 = {
                                id: null,
                                str: null
                            };
                        }
                    }
                }
            }
        }
    }

    function moveSelected(item_id_1, item_id_2) {
        data.identified.push(data.imagesArray[item_id_1]);
        let cart1 = document.getElementById('cart-' + item_id_1);
        let cart2 = document.getElementById('cart-' + item_id_2);
        cart1.parentNode.removeChild(cart1);
        cart2.parentNode.removeChild(cart2);
        let newCart = document.createElement('p');
        newCart.className = "cart";
        newCart.innerHTML = cart1.innerHTML;
        resultBox.appendChild(newCart);
        if (data.identified.length === data.items.length) {
            alert('You win!!!')
        }
    }

    start()

};



