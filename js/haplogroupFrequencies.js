// startup vars
var hfappHeight = 1939,
    hfappWidth = 1106,
    hfimages = [],
    hfloader,
    background = new createjs.Container(),
    newt;


// wrapper
window.HFViewer = {};

//hfloader
(function(){

    var allData, mapItems, keyItems, dataload, src;

    function Loader() {

    }

    Loader.prototype.loadData = function() {

        var storygroupid = document.getElementById("canvasHaplogroupFrequencies").getAttribute("data-haplogroup-id");

        $.getJSON('https://api.moffpart.com/api/1/databases/sdnacontent/collections/c2HaplogroupFrequencies?q={"storygroupid":"'+ storygroupid +'"}&apiKey=50e55b5fe4b00738efa04da0&callback=?', function(ret) {

            src = ret[0].srcItems;

            var manifest = [
                {src:src, id:"image1"}
            ];

            hfloader = new createjs.LoadQueue(false);
            hfloader.addEventListener("fileload", handleFileLoad);
            hfloader.addEventListener("complete", handleComplete);
            hfloader.loadManifest(manifest);

            function handleFileLoad(event) {
                hfimages.push(event.item);
            }

            function handleComplete(event) {

                parseData();
            }
        });

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading frequencies…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + hfappHeight + "px; width:" + hfappWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasHaplogroupFrequencies").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

       newt = new createjs.Bitmap(hfimages[0].src);
       background.addChild(newt);
       dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            mapItems:mapItems,
            keyItems:keyItems
        };

        return allData
    };

    HFViewer.Loader = Loader;

})();

// artboard
(function(){

    // data
    var keyItems, interactionObject;

    // zoom params
    var zoomRatio, xReg, yReg, xpos, ypos, newt;

    function Artboard(){

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };

    }

    Artboard.prototype.dataLoad = function (data){


    };

    Artboard.prototype.zoom = function (user){


    };

    Artboard.prototype.background = function (displayObject){

        // area to add stuff ----->


        displayObject.addChild(background);



        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.redraw = function (displayObject){

        // area to add stuff ----->



        // <------ area to add stuff
    };

    Artboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->


        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    HFViewer.Artboard = Artboard;

})();


// renderer
(function(){

    var stats, canvas, stage, view, control, highlight,
        artboard, artboardBackground, artboardRedraw, artboardEventArea,
        loader, loadStatus;

    HFViewer.loadInit = function(){

        /*stats = new Stats();
        $('.block').prepend(stats.domElement);*/

        // prepare the view
        view = new HFViewer.Artboard(hfappWidth,hfappHeight);

        // hfloader init
        loader = new HFViewer.Loader();
        loadStatus = false;
        loader.loadData();

        TweenMax.ticker.addEventListener("tick", loadRequest);
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        canvas.width = hfappWidth;
        canvas.height = hfappHeight;
        document.getElementById("canvasHaplogroupFrequencies").appendChild(canvas);

        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        // artboard
        artboard = new createjs.Container();
        //artboard.y = 20;
        stage.addChild(artboard);

        artboardBackground = new createjs.Container();
        artboardBackground.cache(0, 0, hfappWidth, hfappHeight);
        artboard.addChild(artboardBackground);
        view.background(artboardBackground);

        artboardRedraw = new createjs.Container();
        artboard.addChild(artboardRedraw);

        artboardEventArea = new createjs.Container();
        artboardEventArea.cache(0, 0, hfappWidth, hfappHeight);
        artboard.addChild(artboardEventArea);
        view.eventlayer(artboardEventArea);

        TweenMax.ticker.addEventListener("tick", frameRender);

    }

    function loadRequest(event) {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.dataLoad(data);
            removeLoader()
        }
    }

    function removeLoader() {

        $('#Processing').remove();
        TweenMax.ticker.removeEventListener("tick", loadRequest);
        init();
    }

    function frameRender(event) {

        //stats.begin();

        artboardRedraw.removeAllChildren();

        view.redraw(artboardRedraw);

        // update stage
        stage.update();

        //stats.end();
    }

})();

//Init
HFViewer.loadInit();