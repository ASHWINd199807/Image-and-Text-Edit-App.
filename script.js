class Editor {
  constructor(targetElem, canvasWidth = 1920, canvasHeight = 1080) {
    if (!targetElem) {
      alert("Target Element is required !");
      return;
    }
    targetElem.innerHTML = ` <div class="parent-div margin-padding-0"> <div id="parent-container" class="tab-container margin-padding-0"> <div class="tab-contents-container margin-padding-0"> <div class="image-upload margin-padding-0"> <button id="display-image-options" class="edit-button horizontal-tab-option-button" > Image </button> <div id="image-options" class="image-options-content"> <div id="insert-image-option" class="image-option"> Insert Image </div> </div> </div> <div class="hidden-element" id="image-upload-popup"> <div class="upload-image-and-close-popup-container"> <div>Upload Image</div> <div id="close-upload-image-popup" class="closePopup">x</div> </div> <div class="upload-image-input-cotainer"> <label class="upload-image-files" for="image-files" >Upload Image </label> <input type="file" id="image-files" multiple accept="image/png, image/jpeg ,image/svg+xml , image/webp" class="hidden-element" /> </div> </div> </div> <div id="text-edit-options" class="text-edit-options-container"> <label for="fontColor">Font Size : </label> <input value="50" id="fontSizeInput" type="number" class="text-edit-options" /> <label for="fontSizeInput">Font Color : </label> <input id="fontColorInput" type="color" class="text-edit-options" /> </div> </div> <div class="canvas-and-options-container margin-padding-0"> <div class="layer-options-conainer margin-padding-0"> <div class="vertical-container-for-options margin-padding-0"> <div class="options-container margin-padding-0"> <button id="textButton" class="edit-button option-button"> Text </button> </div> </div> </div> <div id="dropzone" class="canvas-outer-container margin-padding-0"> <canvas id="canvas" height="${canvasHeight}" width="${canvasWidth}" ></canvas> </div> <div class="commom-options-outer-container margin-padding-0"> <div id="vertical-container-for-options" class="vertical-container-for-options margin-padding-0" > <div id="options-container" class="options-container margin-padding-0" > <button id="download-image" class="edit-button option-button"> Download </button> <button id="image-filters-button" class="image-edit-option-button" > <i style="font-size: 30px; font-weight: lighter" class="fa fa-edit" id="imageEditOptionsButton" ></i> </button> <button id="delete-button" class="delete-option-button"> <i class="fa fa-trash-o" style="font-size: 48px; color: red" ></i> </button> <div id="image-filters-container" class="hidden-element"> <div> <label for="brightness">Brightness </label> <input class="tool-input editInput" type="range" id="brightness" min="0" max="200" /> </div> <div> <label for="saturation">Saturation </label> <input class="tool-input editInput" type="range" id="saturation" min="0" max="200" /> </div> <div> <label for="blur">Blur </label> <input class="tool-input editInput" type="range" id="blur" min="0" max="25" /> </div> <div> <label for="inversion">Inversion </label> <input class="tool-input editInput" type="range" id="inversion" min="0" max="100" /> </div> <div> <label for="opacity">opacity </label> <input class="tool-input editInput" type="range" id="opacity" min="0" max="100" /> </div> <div> <label for="hueRotate">Hue Rotate </label> <input class="tool-input editInput" type="range" id="hueRotate" min="0" max="100" /> </div> <div> <label for="sepia">Sepia </label> <input class="tool-input editInput editInput" type="range" id="sepia" min="0" max="100" /> </div> <div> <label for="contrast">Contrast </label> <input class="tool-input editInput" type="range" id="contrast" min="0" max="500" /> </div> </div> </div> </div> </div> <div class="advanced-tools-and-layer-options-outer-container margin-padding-0" > <div id="advancedTools" class="advanced-tools-and-layer-options-inner-container margin-padding-0" ></div> </div> </div> </div> `;
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.editorManager = new EditorManager(this.canvas, this.context);
    this.checkIfActualClick = null;
    this.mouseDown = false;
    this.draw = () => {
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i of this.editorManager.layersArray) {
        i.draw();
        if (i.isSelected) {
          i.setLayerAsSelected();
        }
      }
    };
    this.layerClickedIndex = null;
    this.layerNumber = (number) => {
      this.layerClickedIndex = number;
    };

    const checkClickEventLocation = (e) => {
      if (
        (e.clientX > 1370 &&
          e.clientX < 1430 &&
          e.clientY > 285 &&
          e.clientY < 865) ||
        (e.clientX > 1440 &&
          e.clientX < 1840 &&
          e.clientY > 550 &&
          e.clientY < 865) ||
        (e.clientX > 1440 &&
          e.clientX < 1840 &&
          e.clientY > 85 &&
          e.clientY < 145) ||
        (e.clientX > 1745 &&
          e.clientX < 1840 &&
          e.clientY > 161 &&
          e.clientY < 540)
      ) {
        document.getElementById("image-filters-container").className =
          "hidden-element";
      }
    };

    const resetOnMouseUp = () => {
      this.editorManager.currentSelectedLayerIndex = null;
      this.editorManager.layerResizePointValue = null;
      this.mouseDown = false;
      this.layerClickedIndex = "layerSelected";
    };

    const canvasMouseDown = (event) => {
      this.mouseDown = true;
      let canvasCoordinate = this.editorManager.clientToCanvasCoordinates(
        event.clientX,
        event.clientY
      );
      let currentX = canvasCoordinate.X;
      let currentY = canvasCoordinate.Y;
      this.editorManager.layerResizePointValue =
        this.editorManager.currentResizePointIndex(
          this.editorManager.selectedLayer,
          currentX,
          currentY
        );
      if (
        (currentX < 0 ||
          currentX > canvasWidth ||
          currentY < 0 ||
          currentY > canvasHeight) &&
        this.layerClickedIndex !== null
      ) {
        let layerElementList = document.getElementsByClassName("layer-class");
        let layerIndex = 0;
        for (let i of layerElementList) {
          if (layerIndex === this.layerClickedIndex) {
            i.className = "layer-list-element-active layer-class";
          } else {
            i.className = "layer-list-element layer-class";
          }
          layerIndex += 1;
        }
        if (
          this.editorManager.selectedLayer &&
          this.editorManager.layerResizePointValue === -1
        ) {
          this.editorManager.layerToSetAsSelected =
            this.editorManager.layersArray[this.layerClickedIndex];
          if (this.editorManager.layerToSetAsSelected) {
            this.editorManager.selectedLayer.isSelected = false;
            this.editorManager.selectedLayer =
              this.editorManager.layerToSetAsSelected; // deselect previous layer and store the new layer selected in that variable
            this.editorManager.selectedLayer.isSelected = true;
            this.editorManager.selectedLayer.mode = "move";
            this.editorManager.setLayerControls();
            document.getElementById("fontSizeInput").value = Math.floor(
              this.editorManager.selectedLayer.fontSize
            );
            document.getElementById("fontColorInput").value =
              this.editorManager.selectedLayer.fgColor;
            this.editorManager.layerToSetAsSelected = null;
            if (this.editorManager.selectedLayer.type === "TEXT") {
              this.editorManager.selectedLayer.setControls();
            } else if (this.editorManager.selectedLayer.type === "IMAGE") {
              this.editorManager.selectedLayer.resetSettingsForCurrentImageLayerFilters();
              this.editorManager.selectedLayer.setControls();
            }
            document.getElementById(
              "vertical-container-for-options"
            ).className =
              "layer-selected-display-delete-button vertical-container-for-options margin-padding-0";
          }
          // if no selected layer exists
        } else if (!this.editorManager.selectedLayer) {
          this.editorManager.selectedLayer =
            this.editorManager.layersArray[this.layerClickedIndex];
          if (this.editorManager.selectedLayer) {
            this.editorManager.setLayerControls();
            this.editorManager.selectedLayer.isSelected = true;
            this.editorManager.selectedLayer.mode = "move";
            document.getElementById("fontSizeInput").value = Math.floor(
              this.editorManager.selectedLayer.fontSize
            );
            document.getElementById("fontColorInput").value =
              this.editorManager.selectedLayer.fgColor;
            if (this.editorManager.selectedLayer.type === "TEXT") {
              this.editorManager.selectedLayer.setControls();
            } else if (this.editorManager.selectedLayer.type === "IMAGE") {
              this.editorManager.selectedLayer.resetSettingsForCurrentImageLayerFilters();

              this.editorManager.selectedLayer.setControls();
            }
          }
          document.getElementById("vertical-container-for-options").className =
            "layer-selected-display-delete-button vertical-container-for-options margin-padding-0";
        }
        this.draw();
      } else {
        if (this.editorManager.selectedLayer) {
          let locationHoveredContainsLayer = false;
          for (let layer of this.editorManager.layersArray) {
            if (this.editorManager.isMouseInLayer(currentX, currentY, layer)) {
              locationHoveredContainsLayer = true;
            }
          }

          if (
            !locationHoveredContainsLayer &&
            this.editorManager.layerResizePointValue === -1
          ) {
            this.editorManager.selectedLayer.isSelected = false;
            this.editorManager.selectedLayer.mode = null;
            this.editorManager.selectedLayer = null;
            document.getElementById(
              "vertical-container-for-options"
            ).className = "vertical-container-for-options margin-padding-0";

            let layerElementList =
              document.getElementsByClassName("layer-class");
            for (let i of layerElementList) {
              i.className = "layer-list-element layer-class";
            }
            document.getElementById("parent-container").className =
              "tab-container margin-padding-0";

            document.getElementById("options-container").className =
              "options-container margin-padding-0";
            document.getElementById("image-filters-container").className =
              "hidden-element";
            this.draw();
            return;
          } else if (this.editorManager.layerResizePointValue !== -1) {
            this.editorManager.selectedLayer.mode = "resizing";
          }
        }

        this.editorManager.startX = canvasCoordinate.X;
        this.editorManager.startY = canvasCoordinate.Y;

        let index = 0;
        for (let layer of this.editorManager.layersArray) {
          if (
            this.editorManager.isMouseInLayer(
              this.editorManager.startX,
              this.editorManager.startY,
              layer
            )
          ) {
            this.editorManager.currentSelectedLayerIndex = index;
          }
          index++;
        }

        if (
          this.editorManager.selectedLayer &&
          this.editorManager.layerResizePointValue === -1
        ) {
          this.editorManager.layerToSetAsSelected =
            this.editorManager.layersArray[
              this.editorManager.currentSelectedLayerIndex
            ];
          if (this.editorManager.layerToSetAsSelected) {
            this.editorManager.selectedLayer.isSelected = false;
            this.editorManager.selectedLayer =
              this.editorManager.layerToSetAsSelected; // deselect previous layer and store the new layer selected in that variable
            this.editorManager.selectedLayer.isSelected = true;
            this.editorManager.selectedLayer.mode = "move";
            this.editorManager.setLayerControls();
            document.getElementById("fontSizeInput").value = Math.floor(
              this.editorManager.selectedLayer.fontSize
            );
            document.getElementById("fontColorInput").value =
              this.editorManager.selectedLayer.fgColor;
            this.editorManager.layerToSetAsSelected = null;
            if (this.editorManager.selectedLayer.type === "TEXT") {
              this.editorManager.selectedLayer.setControls();
            } else if (this.editorManager.selectedLayer.type === "IMAGE") {
              this.editorManager.selectedLayer.resetSettingsForCurrentImageLayerFilters();
              this.editorManager.selectedLayer.setControls();
            }
            document.getElementById(
              "vertical-container-for-options"
            ).className =
              "layer-selected-display-delete-button vertical-container-for-options margin-padding-0";
          }
          // if no selected layer exists
        } else if (!this.editorManager.selectedLayer) {
          this.editorManager.selectedLayer =
            this.editorManager.layersArray[
              this.editorManager.currentSelectedLayerIndex
            ];
          // if mouse down actually on any layer
          if (this.editorManager.selectedLayer) {
            this.editorManager.setLayerControls();
            this.editorManager.selectedLayer.isSelected = true;
            this.editorManager.selectedLayer.mode = "move";
            document.getElementById("fontSizeInput").value = Math.floor(
              this.editorManager.selectedLayer.fontSize
            );
            document.getElementById("fontColorInput").value =
              this.editorManager.selectedLayer.fgColor;
            if (this.editorManager.selectedLayer.type === "TEXT") {
              this.editorManager.selectedLayer.setControls();
            } else if (this.editorManager.selectedLayer.type === "IMAGE") {
              this.editorManager.selectedLayer.resetSettingsForCurrentImageLayerFilters();

              this.editorManager.selectedLayer.setControls();
            }
            document.getElementById(
              "vertical-container-for-options"
            ).className =
              "layer-selected-display-delete-button vertical-container-for-options margin-padding-0";
          }
        }
        let layerElementList = document.getElementsByClassName("layer-class");
        let layerIndex = 0;
        for (let i of layerElementList) {
          if (layerIndex === this.editorManager.currentSelectedLayerIndex) {
            i.className = "layer-list-element-active layer-class";
          } else {
            i.className = "layer-list-element layer-class";
          }
          layerIndex += 1;
        }
        this.draw();
        return;
      }
    };

    const canvasMouseMove = (event) => {
      if (!this.mouseDown) {
        let currentX, currentY;
        let canvasCoordinate = this.editorManager.clientToCanvasCoordinates(
          event.clientX,
          event.clientY
        );
        currentX = canvasCoordinate.X;
        currentY = canvasCoordinate.Y;
        let hoverIndex = 0;
        let currentHoverLayerIndex = null;
        for (let i of this.editorManager.layersArray) {
          if (this.editorManager.isMouseInLayer(currentX, currentY, i)) {
            currentHoverLayerIndex = hoverIndex;
          }
          hoverIndex++;
        }
        this.editorManager.currentLayerToHighlight =
          this.editorManager.layersArray[currentHoverLayerIndex];
        let layerElementList = document.getElementsByClassName("layer-class");
        if (this.editorManager.currentLayerToHighlight) {
          this.draw();
          this.editorManager.context.lineWidth = 5;
          this.editorManager.context.strokeStyle = "red";

          if (this.editorManager.currentLayerToHighlight.type === "TEXT") {
            this.editorManager.context.strokeRect(
              this.editorManager.currentLayerToHighlight.xCoordinate,
              this.editorManager.currentLayerToHighlight.yCoordinate,
              this.editorManager.currentLayerToHighlight.boxWidth,
              this.editorManager.currentLayerToHighlight.fontSize
            );
          } else {
            this.editorManager.context.strokeRect(
              this.editorManager.currentLayerToHighlight.xCoordinate,
              this.editorManager.currentLayerToHighlight.yCoordinate,
              this.editorManager.currentLayerToHighlight.width,
              this.editorManager.currentLayerToHighlight.height
            );
          }
          this.editorManager.context.stroke();
          for (let i of layerElementList) {
            if (i.innerHTML.includes(String(currentHoverLayerIndex))) {
              i.className = "layer-list-element-active layer-class";
              break;
            } else {
              i.className = "layer-list-element layer-class";
            }
          }
        } else {
          for (let i of layerElementList) {
            i.className = "layer-list-element layer-class";
          }
          this.draw();
        }
        let layerIndex = 0;
        for (let i of this.editorManager.layersArray) {
          if (i.isSelected) {
            for (let i of layerElementList) {
              if (i.innerHTML.includes(String(layerIndex))) {
                i.className = "layer-list-element-active layer-class";
                break;
              } else {
                i.className = "layer-list-element layer-class";
              }
            }
          }
          layerIndex = layerIndex + 1;
        }
      } else {
        if (this.editorManager.selectedLayer?.mode === "move") {
          event.preventDefault();
          let mouseX, mouseY;
          let canvasCoordinate = this.editorManager.clientToCanvasCoordinates(
            event.clientX,
            event.clientY
          );
          mouseX = canvasCoordinate.X;
          mouseY = canvasCoordinate.Y;
          let dx = mouseX - this.editorManager.startX;
          let dy = mouseY - this.editorManager.startY;

          this.editorManager.selectedLayer.move(dx, dy);
          this.draw();
          this.editorManager.context.strokeStyle = "red";
          let currentLayerWidth, currentLayerHeight;

          if (this.editorManager.selectedLayer.type === "TEXT") {
            currentLayerWidth = this.editorManager.selectedLayer.boxWidth;
            currentLayerHeight = this.editorManager.selectedLayer.fontSize;
          } else {
            currentLayerWidth = this.editorManager.selectedLayer.width;
            currentLayerHeight = this.editorManager.selectedLayer.height;
          }
          this.editorManager.context.strokeRect(
            this.editorManager.selectedLayer.xCoordinate,
            this.editorManager.selectedLayer.yCoordinate,
            currentLayerWidth,
            currentLayerHeight
          );
          this.editorManager.context.stroke();
          this.editorManager.startX = mouseX;
          this.editorManager.startY = mouseY;
        }

        if (this.editorManager.selectedLayer?.mode === "resizing") {
          let canvasCoordinate = this.editorManager.clientToCanvasCoordinates(
            event.clientX,
            event.clientY
          );
          let currentX = canvasCoordinate.X;
          let currentY = canvasCoordinate.Y;

          this.editorManager.selectedLayer.resize(
            this.editorManager.layerResizePointValue,
            this.editorManager.selectedLayer,
            currentX,
            currentY
          );

          this.draw();
        }
      }
    };

    const addCanvasEvents = (
      canvas,
      canvasMouseMove,
      canvasMouseDown,
      resetOnMouseUp,
      checkClickEventLocation
    ) => {
      if (!canvas) {
        alert("Element not found !");
        return;
      }
      canvas.onmousemove = canvasMouseMove;
      document.onmousedown = canvasMouseDown;
      document.onmouseup = resetOnMouseUp;
      document.onclick = checkClickEventLocation;
    };
    addCanvasEvents(
      this.canvas,
      canvasMouseMove,
      canvasMouseDown,
      resetOnMouseUp,
      checkClickEventLocation
    );
  }
}

class EditorManager {
  constructor(canvas, context) {
    this.context = context; // this is the context
    this.layerElementIndex = 0; // layer index to display in layers list.
    this.currentLayerToHighlight = null; // current layer that will be highlighted.
    this.layersArray = []; // main layers array
    this.startX = null; // used in mousedown function
    this.startY = null; // used in mousedown function
    this.currentSelectedLayerIndex = null; // current selected layer index
    this.selectedLayer = null; // current object
    this.layerToSetAsSelected = null; // used in mousedown operation , if a layer is already selected
    this.layerResizePointValue = null; // returns the canvas hit data for the resize points

    // check if mouse in any layer
    this.isMouseInLayer = (x, y, layer) => {
      let layerLeft = layer.xCoordinate;
      let layertop = layer.yCoordinate;
      let layerbottom, layerRight;
      if (layer.type === "TEXT") {
        layerRight = layer.xCoordinate + layer.boxWidth;
        layerbottom = layer.yCoordinate + layer.fontSize;
      } else {
        layerRight = layer.xCoordinate + layer.width;
        layerbottom = layer.yCoordinate + layer.height;
      }
      if (x > layerLeft && x < layerRight && y > layertop && y < layerbottom) {
        return true;
      }
      return false;
    };

    // returns the canvas coordinates , when sent the mouse event coordinates
    this.clientToCanvasCoordinates = (x, y) => {
      let actualWidth = canvas.width;
      let drawnWidth = canvas.getBoundingClientRect().width;
      let actualHeight = canvas.height;
      let drawnHeight = canvas.getBoundingClientRect().height;
      let scalingFactorDOMToCanvas = actualWidth / drawnWidth;
      let scalingFactorYDOMToCanvas = actualHeight / drawnHeight;

      let canvasXCoordinate =
        scalingFactorDOMToCanvas * (x - canvas.offsetLeft);
      let canvasYCoordinate =
        scalingFactorYDOMToCanvas * (y - canvas.offsetTop);

      let canvasCoordObject = {
        X: canvasXCoordinate,
        Y: canvasYCoordinate,
      };
      return canvasCoordObject;
    };

    // returns the resize point to which the mouse has hit.
    this.currentResizePointIndex = (selectedLayer, x, y) => {
      let layerWidth, layerHeight;

      if (selectedLayer?.type === "TEXT") {
        layerWidth = selectedLayer?.boxWidth;
        layerHeight = selectedLayer?.fontSize;
      } else {
        layerWidth = selectedLayer?.width;
        layerHeight = selectedLayer?.height;
      }
      let dx, dy;
      // top-left
      dx = x - selectedLayer?.xCoordinate;
      dy = y - selectedLayer?.yCoordinate;
      if (dx * dx + dy * dy <= 64) {
        return 0;
      }
      // top-right
      dx = x - (selectedLayer?.xCoordinate + layerWidth);
      dy = y - selectedLayer?.yCoordinate;
      if (dx * dx + dy * dy <= 64) {
        return 1;
      }
      // bottom-right
      dx = x - (selectedLayer?.xCoordinate + layerWidth);
      dy = y - (selectedLayer?.yCoordinate + layerHeight);
      if (dx * dx + dy * dy <= 64) {
        return 2;
      }
      // bottom-left
      dx = x - selectedLayer?.xCoordinate;
      dy = y - (selectedLayer?.yCoordinate + layerHeight);
      if (dx * dx + dy * dy <= 64) {
        return 3;
      }

      // top-middle
      dx = x - (selectedLayer?.xCoordinate + layerWidth / 2);
      dy = y - selectedLayer?.yCoordinate;
      if (dx * dx + dy * dy <= 64) {
        return 4;
      }
      // bottom-middle
      dx = x - (selectedLayer?.xCoordinate + layerWidth / 2);
      dy = y - (selectedLayer?.yCoordinate + layerHeight);
      if (dx * dx + dy * dy <= 64) {
        return 5;
      }

      // vertical-left line
      dx = x - selectedLayer?.xCoordinate;
      dy = y - (selectedLayer?.yCoordinate + layerHeight / 2);
      if (dx * dx + dy * dy <= 64) {
        return 6;
      }

      // vertical-right line
      dx = x - (selectedLayer?.xCoordinate + layerWidth);
      dy = y - (selectedLayer?.yCoordinate + layerHeight / 2);
      if (dx * dx + dy * dy <= 64) {
        return 7;
      }

      return -1;
    };

    document
      .getElementById("insert-image-option")
      .addEventListener("click", () => {
        document.getElementById("image-upload-popup").className =
          "upload-image-popup";
      });

    document
      .getElementById("close-upload-image-popup")
      .addEventListener("click", () => {
        document.getElementById("image-upload-popup").className =
          "hidden-element";
      });

    document
      .getElementById("image-filters-button")
      .addEventListener("click", () => {
        document
          .getElementById("image-filters-container")
          .classList.toggle("image-edit-options");
      });

    document.getElementById("download-image").addEventListener("click", () => {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = canvas.toDataURL("image/png", 5);
      a.download = "canvas-image.png";
      a.click();
      document.body.removeChild(a);
    });

    const textButtonClicked = () => {
      let textLayer = new TextComponent(
        "TEXT",
        this.context,
        "Hello World !",
        0,
        0
      );
      textLayer.draw();

      this.layersArray.push(textLayer);

      advancedToolsContainer.innerHTML =
        advancedToolsContainer.innerHTML +
        `<div onmousedown="layerElementClickedOnLayerList(${this.layerElementIndex})" class="layer-list-element layer-class"> <div class="margin-padding-0"> Layer ${this.layerElementIndex}: ${textLayer.text}</div></div>`;

      this.layerElementIndex = this.layerElementIndex + 1;
    };
    let textButton = document.getElementById("textButton");
    textButton.onclick = textButtonClicked;

    const editInputsArray = document.getElementsByClassName("editInput");
    let advancedToolsContainer = document.getElementById("advancedTools");
    for (let i of editInputsArray) {
      i.addEventListener("input", () => {
        updateSetting(i.id, i.value);
      });
    }
    const updateSetting = (key, value) => {
      this.selectedLayer.filtersArray[key] = Number(value);
      editorInstance.draw();
    };
    let imageSrcArray = [];

    const loadImage = (url) => {
      return new Promise((fulfill, reject) => {
        let imageObj = new Image();
        imageObj.onload = () => fulfill(imageObj);
        imageObj.src = url;
      });
    };

    const uploadFiles = (imageFiles) => {
      const resolveWhenArrayLoaded = () => {
        return new Promise((resolve, reject) => {
          const encodeImageFileAsURL = (file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
              let countOfImageSourceIfSourceAlreadyExists =
                imageSrcArray.filter((image) => {
                  return image.src === reader.result;
                }).length;
              imageSrcArray.push({
                src: reader.result,
                count: countOfImageSourceIfSourceAlreadyExists + 1,
              });
            };
            reader.onerror = () => reject("Files cannot be processed");
            reader.readAsDataURL(file);
          };
          for (let i of imageFiles) {
            encodeImageFileAsURL(i);
          }
          setInterval(() => {
            if (imageSrcArray.length !== 0) {
              resolve(imageSrcArray);
            }
          }, 50);
        });
      };

      resolveWhenArrayLoaded().then(() => {
        for (let i of imageSrcArray) {
          loadImage(i.src).then((image) => {
            if (
              !this.layersArray.some(
                (storedImage) =>
                  storedImage.src === i.src && storedImage.count === i.count
              )
            ) {
              let imageObj = new ImageComponent(
                0,
                0,
                this.context,
                "IMAGE",
                image.width,
                image.height,
                image,
                i.src,
                i.count
              );
              this.layersArray.push(imageObj);
              this.context.drawImage(image, 0, 0, image.width, image.height);
              advancedToolsContainer.innerHTML =
                advancedToolsContainer.innerHTML +
                `<div  onmousedown="layerElementClickedOnLayerList(${this.layerElementIndex})" class="layer-list-element layer-class"> <div class="margin-padding-0"> Layer ${this.layerElementIndex}: Image</div></div>`;
              this.layerElementIndex += 1;
            }
          });
        }

        imageInput.value = null;
      });

      document.getElementById("image-upload-popup").className =
        "hidden-element";
    };

    const imageInputChanged = () => {
      uploadFiles(imageInput.files);
    };

    let imageInput = document.getElementById("image-files");
    imageInput.onchange = imageInputChanged;

    const onDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadFiles(e.dataTransfer.files);
    };

    let imageDropZone = document.getElementById("canvas");
    imageDropZone.ondragover = onDragOver;
    imageDropZone.ondrop = onDrop;

    const onDelete = () => {
      this.layersArray = this.layersArray.filter((layer) => {
        return layer.ID !== this.selectedLayer.ID;
      });
      editorInstance.draw();
      document.getElementById("vertical-container-for-options").className =
        "vertical-container-for-options margin-padding-0";
      document.getElementById("image-filters-container").className =
        "hidden-element";
      document.getElementById("parent-container").className =
        "tab-container margin-padding-0";
      document.getElementById("options-container").className =
        "options-container margin-padding-0";
    };
    let deleteButton = document.getElementById("delete-button");
    deleteButton.onclick = onDelete;
  }

  setLayerControls() {
    document
      .getElementById("fontColorInput")
      .addEventListener("input", (event) => {
        this.selectedLayer?.changeFontColor(event.target.value);
        editorInstance.draw();
      });
    document
      .getElementById("fontSizeInput")
      .addEventListener("input", (event) => {
        this.selectedLayer?.setFontSize(Number(event.target.value));
        editorInstance.draw();
      });
  }
}

class Component {
  constructor(x, y, context, type, width, height, fgColor, bgColor) {
    this.xCoordinate = x || x === 0 ? x : 100;
    this.yCoordinate = y || y === 0 ? y : 100;
    this.context = context;
    this.type = type;
    this.height = height ? height : 100;
    this.width = width ? width : 100;
    this.fgColor = fgColor ? fgColor : "black";
    this.bgColor = bgColor ? bgColor : null;
    this.isSelected = false;
    this.mode = null;
    this.ID = `layer#${editorInstance.editorManager.layersArray.length + 1}`;
    this.drawResizePoint = (context, x, y) => {
      context.beginPath();
      context.arc(x, y, 8, 0, Math.PI * 2, false);
      context.fillStyle = "red";
      context.fill();
      context.closePath();
    };
  }

  setLayerAsSelected() {
    let layerWidth, layerHeight;
    if (this.type === "TEXT") {
      layerWidth = this.boxWidth;
      layerHeight = this.fontSize;
    } else {
      layerWidth = this.width;
      layerHeight = this.height;
    }
    this.drawResizePoint(this.context, this.xCoordinate, this.yCoordinate);
    this.drawResizePoint(
      this.context,
      this.xCoordinate + layerWidth,
      this.yCoordinate
    );
    this.drawResizePoint(
      this.context,
      this.xCoordinate + layerWidth,
      this.yCoordinate + layerHeight
    );
    this.drawResizePoint(
      this.context,
      this.xCoordinate,
      this.yCoordinate + layerHeight
    );
    this.drawResizePoint(
      this.context,
      this.xCoordinate + layerWidth / 2,
      this.yCoordinate
    );
    this.drawResizePoint(
      this.context,
      this.xCoordinate + layerWidth / 2,
      this.yCoordinate + layerHeight
    );
    this.drawResizePoint(
      this.context,
      this.xCoordinate,
      this.yCoordinate + layerHeight / 2
    );
    this.drawResizePoint(
      this.context,
      this.xCoordinate + layerWidth,
      this.yCoordinate + layerHeight / 2
    );
    this.context.beginPath();
    this.context.fillStyle = "black";
  }

  move(xChange, yChange) {
    this.xCoordinate += xChange;
    this.yCoordinate += yChange;
  }

  setHeight(recivedFont) {
    if (typeof recivedFont === "number") {
      this.fontSize = recivedFont;
    } else {
      alert("Invlaid Font Size!");
    }
  }

  setXCoordinate(recivedXCoordinate) {
    if (!isNaN(recivedXCoordinate)) {
      this.xCoordinate = Number(recivedXCoordinate);
    } else {
      alert("Invlaid Coordinate !");
    }
  }

  setYCoordinate(recivedYCoordinate) {
    if (!isNaN(recivedYCoordinate)) {
      this.yCoordinate = Number(recivedYCoordinate);
    } else {
      alert("Invlaid Coordinate !");
    }
  }
  setFgColor(recivedColor) {
    this.fgColor = recivedColor;
  }
}

class ImageComponent extends Component {
  constructor(x, y, context, type, width, height, imageValue, src, count) {
    super(x, y, context, type, width, height);
    this.imageValue = imageValue;
    this.src = src;
    this.count = count;
    this.previousCoordinate = null;
    this.filtersArray = {
      brightness: 100,
      saturation: 100,
      blur: 0,
      inversion: 0,
      opacity: 100,
      hueRotate: 0,
      sepia: 0,
      contrast: 100,
    };
  }
  draw() {
    this.context.filter = `brightness(${this.filtersArray.brightness}%) saturate(${this.filtersArray.saturation}%) blur(${this.filtersArray.blur}px) invert(${this.filtersArray.inversion}%) opacity(${this.filtersArray.opacity}%) hue-rotate(${this.filtersArray.hueRotate}deg)  sepia(${this.filtersArray.sepia}%) contrast(${this.filtersArray.contrast}%) `;
    this.context.drawImage(
      this.imageValue,
      this.xCoordinate,
      this.yCoordinate,
      this.width,
      this.height
    );
    this.context.filter = "none";
  }
  setControls() {
    document.getElementById("parent-container").className =
      "tab-container margin-padding-0";
    document.getElementById("options-container").className =
      "active-image options-container margin-padding-0";
  }
  resetSettingsForCurrentImageLayerFilters = () => {
    const brightnessInput = document.querySelector("#brightness");
    const saturationInput = document.querySelector("#saturation");
    const blurInput = document.querySelector("#blur");
    const inversionInput = document.querySelector("#inversion");
    const opacityInput = document.querySelector("#opacity");
    const hueRotateInput = document.querySelector("#hueRotate");
    const sepiaInput = document.querySelector("#sepia");
    const contrastInput = document.querySelector("#contrast");
    // reset the inputs according to the current image selected.
    brightnessInput.value = this.filtersArray.brightness;
    saturationInput.value = this.filtersArray.saturation;
    blurInput.value = this.filtersArray.blur;
    inversionInput.value = this.filtersArray.inversion;
    opacityInput.value = this.filtersArray.opacity;
    hueRotateInput.value = this.filtersArray.hueRotate;
    sepiaInput.value = this.filtersArray.sepia;
    contrastInput.value = this.filtersArray.contrast;
  };
  resize(layerResizePointValue, selectedLayer, currentX, currentY) {
    let aspectRatio = selectedLayer.width / selectedLayer.height;
    switch (layerResizePointValue) {
      case 0:
        //top-left
        let height = selectedLayer.height;
        selectedLayer.width =
          selectedLayer.xCoordinate + selectedLayer.width - currentX;
        selectedLayer.xCoordinate = currentX;
        selectedLayer.height = selectedLayer.width / aspectRatio;
        selectedLayer.yCoordinate =
          selectedLayer.yCoordinate + height - selectedLayer.height;
        break;
      case 1:
        //top-right
        selectedLayer.height =
          selectedLayer.yCoordinate + selectedLayer.height - currentY;
        selectedLayer.yCoordinate = currentY;
        selectedLayer.xCoordinate = selectedLayer.xCoordinate;
        selectedLayer.width = selectedLayer.height * aspectRatio;
        break;
      case 2:
        //bottom-right
        selectedLayer.height = currentY - selectedLayer.yCoordinate;
        selectedLayer.yCoordinate = selectedLayer.yCoordinate;
        selectedLayer.xCoordinate = selectedLayer.xCoordinate;
        selectedLayer.width = selectedLayer.height * aspectRatio;
        break;
      case 3:
        // bottom -left
        selectedLayer.width =
          selectedLayer.xCoordinate + selectedLayer.width - currentX;
        selectedLayer.height = selectedLayer.width / aspectRatio;
        selectedLayer.xCoordinate = currentX;
        break;
      case 4:
        //top middle
        selectedLayer.height =
          selectedLayer.yCoordinate + selectedLayer.height - currentY;
        selectedLayer.yCoordinate = currentY;
        break;
      case 5:
        // bottom middle
        selectedLayer.height = currentY - selectedLayer.yCoordinate;
        break;
      case 6:
        //vertical left
        selectedLayer.width =
          selectedLayer.width + selectedLayer.xCoordinate - currentX;
        selectedLayer.xCoordinate = currentX;
        break;
      case 7:
        // vertical right
        selectedLayer.width = currentX - selectedLayer.xCoordinate;
        break;
    }
  }
}

class TextComponent extends Component {
  constructor(type, context, text, x, y, fontSize, fontWidth) {
    super(x, y, context, type);
    this.text = text ? text : "Hello World";
    this.fontSize = fontSize ? fontSize : 50;
    this.context.font = `${this.fontSize}px  Arial`;
    this.fontWidth = fontWidth ? fontWidth : 50;
    this.boxHeight = this.fontSize;
    this.boxWidth = this.context.measureText(this.text).width;
    this.previousCoordinate = null;
  }
  draw() {
    let pen = getDefaultContext(this.context);
    pen.textBaseline = "top";
    pen.font = `${this.fontSize}px  Arial`;
    pen.fillStyle = `${this.fgColor}`;
    this.boxWidth = pen.measureText(this.text).width;
    pen.fillText(this.text, this.xCoordinate, this.yCoordinate);
  }

  setControls() {
    document.getElementById("parent-container").className =
      "active-text tab-container margin-padding-0";

    document.getElementById("options-container").className =
      "options-container margin-padding-0";

    document.getElementById("image-filters-container").className =
      "hidden-element";
  }

  resize(layerResizePointValue, selectedLayer, currentX, currentY) {
    let fontAspectRatio = selectedLayer.boxWidth / selectedLayer.fontSize;
    let storeFontSize;

    switch (layerResizePointValue) {
      case 0:
        //top-left point
        if (
          selectedLayer.xCoordinate + selectedLayer.boxWidth >
            selectedLayer.xCoordinate  &&
            currentX< selectedLayer.xCoordinate + selectedLayer.boxWidth &&
            currentY<selectedLayer.yCoordinate+selectedLayer.fontSize+1
        ) 
        storeFontSize =
          selectedLayer.yCoordinate + selectedLayer.fontSize - currentY;
        if(selectedLayer.fontSize>1){  
        selectedLayer.yCoordinate = currentY;
        this.context.font = `${storeFontSize}px  Arial`;
        let newWidthTopLeftPoint = this.context.measureText(
          selectedLayer.text
        ).width;
        selectedLayer.xCoordinate =
          selectedLayer.xCoordinate +
          selectedLayer.boxWidth -
          newWidthTopLeftPoint;}
       
        break;
      case 1:
        //top-right point
        if (
          selectedLayer.xCoordinate + selectedLayer.boxWidth >
            selectedLayer.xCoordinate + 1 &&
          currentX > selectedLayer.xCoordinate &&
          currentY < selectedLayer.yCoordinate + selectedLayer.fontSize
        ) {
          storeFontSize =
            selectedLayer.yCoordinate + selectedLayer.fontSize - currentY;
          selectedLayer.yCoordinate = currentY;
          selectedLayer.xCoordinate = selectedLayer.xCoordinate;
          
        }
        break;
      case 2:
        //bottom-right point

        storeFontSize = currentY - selectedLayer.yCoordinate;
        selectedLayer.yCoordinate = selectedLayer.yCoordinate;
        selectedLayer.xCoordinate = selectedLayer.xCoordinate;
       
        break;
      case 3:
        //bottom-left point
        if (
          storeFontSize > 1 ||
          currentX < selectedLayer.xCoordinate + selectedLayer.boxWidth
        ) {
          storeFontSize = currentY - selectedLayer.yCoordinate;
          this.context.font = `${storeFontSize}px  Arial`;
          let newWidthBottomLeftPoint = this.context.measureText(
            selectedLayer.text
          ).width;
          if (storeFontSize > 1) {
            selectedLayer.xCoordinate =
              selectedLayer.xCoordinate +
              selectedLayer.boxWidth -
              newWidthBottomLeftPoint;
           
          }
        }
        break;

      case 4:
        // top-middle point
        if (currentY < selectedLayer.yCoordinate + selectedLayer.fontSize) {
          storeFontSize =
            selectedLayer.yCoordinate + selectedLayer.fontSize - currentY;
          selectedLayer.yCoordinate = currentY;
          this.context.font = `${storeFontSize}px  Arial`;

          let newWidthTopMiddlePoint = this.context.measureText(
            selectedLayer.text
          ).width;

          selectedLayer.xCoordinate =
            selectedLayer.xCoordinate +
            (selectedLayer.boxWidth - newWidthTopMiddlePoint) / 2;
          
        }
        break;

      case 5:
        // bottom-middle point
        if (currentY > selectedLayer.yCoordinate) {
          storeFontSize = currentY - selectedLayer.yCoordinate;
          this.context.font = `${storeFontSize}px  Arial`;
          let newWidthBottomMiddlePoint = this.context.measureText(
            selectedLayer.text
          ).width;
          selectedLayer.xCoordinate =
            selectedLayer.xCoordinate +
            (selectedLayer.boxWidth - newWidthBottomMiddlePoint) / 2;

         
        }
        break;

      case 6:
        //vertical-left-point
        if (
          selectedLayer.fontSize > 1 ||
          currentX < selectedLayer.xCoordinate + selectedLayer.boxWidth
        ) {
          let previousFontSizeForVerticalLeftPoint = selectedLayer.fontSize;
          let newTextWidthForVerticalLeftPoint =
            selectedLayer.xCoordinate + selectedLayer.boxWidth - currentX;
          storeFontSize = newTextWidthForVerticalLeftPoint / fontAspectRatio;
          if (selectedLayer.fontSize > 1) {
            selectedLayer.yCoordinate =
              selectedLayer.yCoordinate +
              (previousFontSizeForVerticalLeftPoint - storeFontSize) / 2;
            selectedLayer.xCoordinate = currentX;
          }
         
        }
        break;

      case 7:
        // vertical-right-point
        if (currentX > selectedLayer.xCoordinate) {
          let previousFontSizeForVerticalRightPoint = selectedLayer.fontSize;
          let newWidth = currentX - selectedLayer.xCoordinate;
          storeFontSize = newWidth / fontAspectRatio;
          selectedLayer.yCoordinate =
            selectedLayer.yCoordinate +
            (previousFontSizeForVerticalRightPoint - storeFontSize) / 2;
          
        }
        break;
    }

    if (storeFontSize > 1 || storeFontSize === 1) {
      selectedLayer.fontSize = storeFontSize;
    } else {
      selectedLayer.fontSize = 1;
    }
    document.getElementById("fontSizeInput").value =
    Math.floor(selectedLayer.fontSize);
  }

  setText(textString) {
    if (typeof textString === "string") {
      this.text = textString;
    } else {
      alert("Invlaid String !");
    }
  }

  setFontSize(recivedFont) {
    if (typeof recivedFont === "number") {
      this.fontSize = recivedFont;
    } else {
      alert("Invlaid Font Size!");
    }
  }

  changeXc(recivedXCoordinate) {
    this.setXCoordinate(recivedXCoordinate);
  }

  changeFontColor(recivedColor) {
    this.setFgColor(recivedColor);
  }
  changeYc(recivedYCoordinate) {
    this.setYCoordinate(recivedYCoordinate);
  }
}
/******************************************************************************/
// UTILITITES
const getDefaultContext = (context) => {
  context.textBaseline = "top";
  context.font = "50px  Arial";
  context.fillStyle = "black";
  return context;
};
const layerElementClickedOnLayerList = (currentLayerIndex) => {
  editorInstance.layerNumber(currentLayerIndex);
};
