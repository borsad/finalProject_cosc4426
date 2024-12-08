AFRAME.registerComponent("log-nodes-on-load", {
  init: function () {
    this.el.addEventListener("model-loaded", () => {
      const model = this.el.getObject3D("mesh"); // Access the 3D object
      if (model) {
        console.log("Microbrewery model loaded. Traversing nodes:");
        model.traverse((node) => {
          console.log(node.name || "Unnamed Node", node); // Log node details
        });
      } else {
        console.warn("Model is loaded but mesh is unavailable.");
      }
    });
  },
});

AFRAME.registerComponent("attach-to-camera", {
  init: function () {
    this.isAttached = false; // Track if the bottle is attached
    this.el.addEventListener("click", () => {
      console.log("Bottle clicked!");
      const camera = document.querySelector("#camera");
      camera.appendChild(this.el); // Attach to camera
      this.el.setAttribute("position", "0 0 -2"); // Adjust position relative to the camera
      this.el.setAttribute("animation", {
        property: "position",
        to: "0 0 -2",
        dur: 1000,
        easing: "easeInOutQuad",
      }); // Smooth transition
      this.isAttached = true; // Mark the bottle as attached
    });
  },
});

AFRAME.registerComponent("play-sound-on-barrel", {
  schema: {
    bottleSelector: { type: "selector" }, // Selector for the bottle
    sound: { type: "selector" }, // Selector for the sound entity
  },
  init: function () {
    const bottleEntity = this.data.bottleSelector;

    if (!bottleEntity) {
      console.error("Bottle entity not found. Check the bottleSelector value.");
      return;
    }

    const soundEntity = this.data.sound;

    if (!soundEntity) {
      console.error("Sound entity not found. Selector:", this.data.sound);
      return;
    }

    this.el.addEventListener("click", () => {
      const isBottleAttached = bottleEntity.components["attach-to-camera"]
        ? bottleEntity.components["attach-to-camera"].isAttached
        : false;

      if (isBottleAttached) {
        console.log("Barrel clicked, playing sound.");
        if (soundEntity.components && soundEntity.components.sound) {
          soundEntity.components.sound.playSound();
        } else {
          console.error("Sound component not initialized on:", soundEntity);
        }
      } else {
        console.log("Bottle is not attached. Sound will not play.");
      }
    });
  },
});
document
  .querySelector("#microbreweryEntity")
  .addEventListener("click", function () {
    const soundComponent = this.components.sound;
    if (soundComponent) {
      soundComponent.playSound(); // Play the fermentation sound
      console.log("Playing fermentation sound...");
    } else {
      console.error("Sound component is missing or not initialized.");
    }
  });
