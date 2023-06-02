// First get the context of the canvas as the gradient is created on this.
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Create radial gradient (this works best with the roundness of the wheel)
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
// Many values should be the centre of the canvas. If the canvas is square can just use the height / 2.
// The remaining values are the radius of the starting circle then the radius of the ending circle.

let theWheel = new Winwheel({
  numSegments: 4, // Specify number of segments.
  drawMode: "image",
  drawText: false,
  outerRadius: 130, // Set outer radius so wheel fits inside the background.
  textFontSize: 24, // Set font size as desired.
  // Define segments including colour and text.
  segments: [
    { text: "Phần quà" },
    { text: "Voucher 20k" },
    { text: "Voucher 50k" },
    { text: "Thêm lượt quay" },
  ],

  // Specify the animation to use.
  animation: {
    type: "spinToStop",
    duration: 5, // Duration in seconds.
    spins: 4, // Number of complete spins.
    callbackFinished: alertPrize,
    callbackSound: playSound, //Hàm gọi âm thanh khi quay
    soundTrigger: "pin", //Chỉ định chân là để kích hoạt âm thanh
  },
  // pins: {
  //   number: 16, //Số lượng chân. Chia đều xung quanh vòng quay.
  // },
});
let loadedImg = new Image();
loadedImg.src =
  "https://blog-bbh.s3.ap-southeast-1.amazonaws.com/vongquay-6-1651798476.png";
theWheel.wheelImage = loadedImg;
theWheel.draw();

// Vars used by the code in this page to do power controls.
let wheelPower = 0;
let wheelSpinning = false;
let fullname = null;
let phone = null;
let gif = null;
document.getElementById("countWheel").innerHTML = 1;

let audio = new Audio("sound/tick.mp3");
function playSound() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}
function checkData() {
  this.startSpin();
}
// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
  // Ensure that spinning can't be clicked again while already running.
  if (wheelSpinning == false) {
    // document.getElementById('wheel').scrollIntoView({
    //   behavior: 'smooth'
    // });
    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
    // to rotate with the duration of the animation the quicker the wheel spins.
    if (wheelPower == 1) {
      theWheel.animation.spins = 3;
    } else if (wheelPower == 2) {
      theWheel.animation.spins = 8;
    } else if (wheelPower == 3) {
      theWheel.animation.spins = 15;
    }

    // Disable the spin button so can't click again while wheel is spinning.
    // document.getElementById('spin_button').src = '../scr/img/spin_off.png';
    // document.getElementById('spin_button').className = '';

    // Begin the spin animation by calling startAnimation on the wheel object.
    theWheel.startAnimation();
    document.getElementById("countWheel").innerHTML = 0;
    // Set to true so that power can't be changed and spin button re-enabled during
    // the current animation. The user will have to reset before spinning again.
    wheelSpinning = true;
  }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
  theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
  theWheel.draw(); // Call draw to render changes to the wheel.
  wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
  gif = indicatedSegment.text;
  if (gif != "Thêm lượt quay") {
    document.getElementById("input-infor").style.display = "block";
    document.getElementById("conti-wheel").style.display = "none";

    document.getElementById("title-modal").innerHTML = "Xin chúc mừng !!!";
    document.getElementById("content-modal").innerHTML =
      "Phần quà của bạn là : " + gif;
    document.getElementById("sucess-form").style.display = "block";

    $("#modal").modal("show");
  } else {
    this.resetWheel();
    document.getElementById("conti-wheel").style.display = "block";
    document.getElementById("input-infor").style.display = "none";

    document.getElementById("title-modal").innerHTML = "Thử lại nào !!!";
    document.getElementById("content-modal").innerHTML =
      "Bạn nhân được thêm 1 lượt quay";
    $("#modal").modal("show");
    document.getElementById("countWheel").innerHTML = 1;
  }
}
function sendData() {
  if ($('input[name="name"]').val() == "") {
    document.getElementById("name").classList.add("is-invalid");
    document.getElementById("errorName").innerHTML = "Vui lòng nhập họ tên";
  } else if ($('input[name="phone"]').val() == "") {
    document.getElementById("phone").classList.add("is-invalid");
    document.getElementById("errorPhone").innerHTML =
      "Vui lòng nhập số điện thoại";
  } else {
    fullname = $('input[name="name"]').val();
    phone = $('input[name="phone"]').val();
    let data = {
      "entry.2017066631": fullname,
      "entry.1129439822": phone,
      "entry.666980564": gif,
    };
    console.log(data);
    var queryString = new URLSearchParams(data);
    queryString = queryString.toString();
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfPZ7-dYZceFQh_9SwRrlivU8h_fR4lkMI5E0Nm5k_P32QFEQ/formResponse",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(queryString);
    $("#modal").modal("hide");
  }
}
