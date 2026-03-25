var rec;

function DownloadImage(c, imageName)
{
	const a = document.createElement('a');
	a.download = imageName + ".png";
	a.onclick = function () {
		var dataURL = c.toDataURL('image/png');
		a.href = dataURL;
	}
	a.click();
}

function startRecording(c) {
  const chunks = []; // here we will store our recorded media chunks (Blobs)
  const stream = c.captureStream(30); // grab our canvas MediaStream
  rec = new MediaRecorder(stream); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = e => chunks.push(e.data);
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = e => exportVid(new Blob(chunks, {type: 'video/webm'}));
  rec.start();
  RecordingStatus.innerHTML = "Now Recording";
}

function stopRecording() {
	rec.stop()
}

function exportVid(blob)
{
  const vid = document.createElement('video');
  //vid.style.display = "none";
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.body.appendChild(vid);
  const a = document.createElement('a');
  a.download = 'myvid.webm';
  a.href = vid.src;
  a.textContent = 'download the video';
  RecordingStatus.innerHTML = "Recording Finished";
  a.click();
}

function downloadText(text, name)
{
	var a = document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([text], {type: "text/plain"}));
	a.download = name;
	a.click();
}

