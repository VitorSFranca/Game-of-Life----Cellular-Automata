init  = function (){
    var cells = [], original = [], lastGeneration = [], estavel = [];
    var map = [];
    var historical = [];
    var _i, _j, _k;
    // var total = 900-116; //Number where i can see all cells
    var total = 900-200; //Number where i can see all cells
    var block = Math.round(Math.sqrt(total));
    var generation = 1;
    var headerDiv;
    var startPopulation;
    var maxPopulation;
    var minPopulation;
    var avgPopulation; 
    var currentPopulation;
    var numberNextGenerations, qtdOriginal, stopAtGeneration;

    /**
     * Create html elements
     */
    var createElements = function(){
        document.write("<br /");
        var enviroment = document.getElementById("enviroment");
        var table = document.createElement("table");
        table.setAttribute("width","100%");
        var row, column;
        var index = 0;

        for(i = 0; i < block; i++){
            row = document.createElement("tr");
            row.setAttribute("id",i);
            for(j = 0; j < block; j++){
                column = document.createElement("td");
                column.setAttribute("id",index++);
                column.setAttribute("bgcolor","#8d8d8d");
                column.setAttribute("height","16");
                column.addEventListener("click",function(){
                    if(cells[this.id]){
                        setDead(this);
                    } else {
                        setAlive(this);   
                    }
                });
                row.appendChild(column);
                map.push(column);
                cells.push(0);
            }
            table.appendChild(row);
        }    
        enviroment.appendChild(table);
        // for(i = 0; i < rowNodes.length; i++){
        //     console.log(rowNodes[i].childNodes);
        // }

        // enviroment.appendChild(table);
        // for(_i = 0; _i < total; _i++){
        //     cells.push(0);
        //     map.push(document.createElement("input"));
        //     map[_i].setAttribute("type","radio");
        //     map[_i].checked = false;
        // }
    }

    /**
     * Kill(set false) all cells
     * @param {*} arr 
     */
    var emptyArray = function(arr){
        for(var _i = 0; _i < arr.length; _i++){
            arr[_i] = 0;
        }
        return arr;
    }

    /**
     * Populate, and create a default start population
     * Like: %
     *        % 
     *      %%%
     */
    var populate = function(){
        if(actualPopulation(cells) === 0){
            cells[1] = 1;
            cells[block + 2] = 1;
            cells[block * 2] = 1;
            cells[(block * 2) + 1] = 1;
            cells[(block * 2) + 2] = 1;
        }
    }

    /**
     * Set all metrics values to start values
     */
    var startMetricsValues = function(){
        currentPopulation = actualPopulation(cells);
        minPopulation = currentPopulation;
        maxPopulation = currentPopulation;
        startPopulation = currentPopulation;
        generation = 1;
        historical = [];
    }

    /**
     * Show current metrics values in html
     */
    var showMetricsValues = function(){
        document.querySelector("#popIni").textContent = startPopulation;
        document.querySelector("#popAct").textContent = actualPopulation(cells);
        document.querySelector("#popMax").textContent = maxPopulation;
        document.querySelector("#popMin").textContent = minPopulation;
        document.querySelector("#genAct").textContent = generation;
    }

    /**
     * Shows html elements.
     */
    var showHtml = function(){
        headerDiv = document.createElement('div');
        document.body.appendChild(headerDiv);
        startMetricsValues();
        showMetricsValues();
    }

    // Set cell is alive
    var setAlive = function(cell){
        cells[cell.id] = 1;
        cell.setAttribute("bgcolor","#1f5ca4");
    }

    // Set cell is dead
    var setDead = function(cell){
        cells[cell.id] = 0;
        cell.setAttribute("bgcolor","8d8d8d");
    }


    /**
     * Desenha todo o ambiente de simualação de acordo com a geração atual.
     * @param array arr
     */
    var drawWorld = function(arr){
        var arrLength = arr.length;
        for(_i = 0; _i < arrLength; _i++){
            if(arr[_i] == 1){
                setAlive(map[_i]);
            } else {
                setDead(map[_i]);
            }
            // map[_i].checked = false;
            // if(arr[_i] == 1){
            //     map[_i].checked = true;
            // }
        }
    }

    /**
    * Return an array with the selected cell neighborhood
    * @param array arr
    * @param int posicao
    * @return object
    */
    var neighbors = function(arr, posicao){
        var arrLength = arr.length;
        if(posicao > arrLength) return {};
        var vz = {};

        if((posicao + 1) % block == 0){

            vz.diagonalSDir = 0;
            vz.direita = 0;
            vz.diagonalIDir = 0;

            vz.diagonalSEsq = arr[posicao - (block + 1)] || 0;
            vz.esquerda = arr[posicao - 1] || 0;
            vz.diagonalIEsq = arr[posicao + (block - 1)] || 0;
        } else if((posicao == 0 || posicao % block == 0)){
            
                vz.diagonalSEsq =  0;
                vz.esquerda =      0;
                vz.diagonalIEsq =  0;
               
                vz.diagonalSDir = arr[posicao - (block - 1)] || 0;
                vz.direita = arr[posicao + 1] || 0;
                vz.diagonalIDir = arr[posicao + (block + 1)] || 0
        } else {
                vz.diagonalSEsq = arr[posicao - (block + 1)] || 0;
                vz.esquerda = arr[posicao - 1] || 0;
                vz.diagonalIEsq = arr[posicao + (block - 1)] || 0;

                vz.diagonalSDir = arr[posicao - (block - 1)] || 0;
                vz.direita = arr[posicao + 1] || 0;
                vz.diagonalIDir = arr[posicao + (block + 1)] || 0;
        }


        vz.acima = arr[posicao - block] || 0;
        vz.abaixo = arr[posicao + block] || 0;

        return vz;
    }

    /**
     * Generate next state according life conditions
     * @param array arr
     */
    var nextState = function(arr) {
        var vz, neighborhood, nState = [];
        for(_k = 0; _k < arr.length; _k++){
            vz = neighbors(arr,_k);
            neighborhood = contaBairro(vz);

            //Die because by solitude
            if(neighborhood < 2){
                nState[_k] = 0;
            } else if((neighborhood == 2 || neighborhood == 3) && arr[_k] == 1){
                nState[_k] = 1;
                // Survive
            } else if( neighborhood == 3 && arr[_k] == 0){
                nState[_k] = 1;
                // Born
            } else if(neighborhood > 3){
                nState[_k] = 0;
                // Die because of superpopulation
            } else {
                nState[_k] = 0;
                // Other
            }
        }
        return nState;
    }

    /**
     * Conta o número de neighbors que a celula possui
     * @param object neighbors
     */
    var contaBairro = function(neighbors){
        var neighborhood = 0;

        for(key in neighbors){
            if(neighbors[key] === 1) neighborhood++;
        }

        return neighborhood;
    }

    /**
     * Calculate how many cells still alive in the enviroment
     * @param array arr
     */
    var actualPopulation = function(arr){
        var total = 0;
        arr.forEach(function(element) {
            total += element;
        }, this);

        return total;
    }

    /**
     * Generate,
     * @param int numberNextGenerations
     * @param int delay
     */
    var newGeneration = function(delay){
        // Draw current generation(world)
        drawWorld(cells);
        findPattern(cells);
        historical.push(cells);

        // Saves last generation
        lastGeneration = cells.slice(0);

        // Generate next state
        cells = nextState(cells);
        numberNextGenerations = decreaseNextGenerations(numberNextGenerations);

        // Set and show current metrics
        newMetrics();
        showMetricsValues();

        if(numberNextGenerations > 1){
            if(actualPopulation(cells) >= 3){
                setTimeout(function(){
                    if(numberNextGenerations - 1 > 0){
                        generation++;
                        newGeneration(numberNextGenerations-1,delay);
                    }
                },delay)
            } else {
                reset(original);
                console.log(messages.populationZero);
            }
        } else {
            reset(original);
            console.log(messages.populationZero);
        }
    }

    var findPattern = function(currentCells){
        var cellsAsAstring = JSON.stringify(currentCells);
        
          var patternFound = historical.some(function(ele){
            return JSON.stringify(ele) === cellsAsAstring;
          });

          if(patternFound){
              var type = "";
              if(JSON.stringify(historical[historical.length - 1]) == cellsAsAstring){
                  type = "Imutable.";
              } else {
                  type = "Mutable.";
              }
              console.log("Patter found!" + type);
          }
    }

    /**
     * Decrease generation numbers
     */
    var decreaseNextGenerations = function(){
        return --numberNextGenerations;
    }

    /**
     * Set new metrics
     * 1) CurrentPopulation
     * 2) MaxPopulation
     * 3) MinPopulation
     * @param {*} currentPopulation 
     */
    var newMetrics = function(currentPopulation){
        // Count current population
        currentPopulation = actualPopulation(cells);

        if(currentPopulation > maxPopulation) maxPopulation = currentPopulation;
        if(currentPopulation < minPopulation) minPopulation = currentPopulation;
    };

    /**
     * Update the map
     */
    var update = function(){
        for(var i = 0; i < map.length; i++){
            if(map[i].checked == true){
                cells[i] = 1;
            }
        }
    }

    createElements();
    emptyArray(cells);
    showHtml();

    /**
     * Inicia a simulação
     * @param int total
     */
    var init = function(){
        //Invalida botao iniciar, valida botao parar
        document.querySelector("#iniciar").disabled = true;
        document.querySelector("#parar").disabled = false; 

        update();
        if(!actualPopulation(original)){
            original = cells.slice(0);
        }

        numberNextGenerations = 1000;
        populate();
        
        startMetricsValues();

        drawWorld(cells);

        newGeneration(1000);
    }

    /**
     * Reset enviroment, and metrics
     * @param {*} arr 
     */
    var reset = function(arr){
        cells = (typeof arr == Array && arr.length == total) ? arr.slice(0) : emptyArray(cells);
        startMetricsValues();
        showMetricsValues();
        drawWorld(cells);
        generation = 1;
        document.querySelector("#iniciar").disabled = false;
    }

    /**
     * Stop the simulation
     */
    var stop = function(){
        stopAtGeneration = numberNextGenerations;
        numberNextGenerations = 0;
        document.querySelector("#parar").disabled = true;
        document.querySelector("#iniciar").disabled = false;
    }

    /**
     * Fill the enviroment with random positions
     */
    var random = function(){
        var totalAlive = Math.ceil(Math.random()*map.length);
        var index, current;
        for(var i = 0; i < totalAlive; i++){
            do{
                index = Math.floor(Math.random() * map.length);
                current = cells[index];
            } while(current == 1);
            setAlive(map[index]);
            // current.checked = true;   
        }

        update();
        startMetricsValues();
        showMetricsValues();
    };

    /**
     * Messages
     */
    var messages = {
        populationZero: "Everybody died!"
    };


    document.querySelector("#iniciar").onclick = init;
    document.querySelector("#reset").onclick = reset;
    document.querySelector("#parar").onclick = stop;
    document.querySelector("#random").onclick = random;
}();