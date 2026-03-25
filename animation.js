function smoothTransition(t, duration, start, end)
{
	var t = t/duration;
	var f = 0.5;
	var A = end-start;

	if (t < 1)
		return (A/2) - (A/2) * Math.cos(2 * Math.PI * f * t) + start;
	else
		return end;
}

function linearTransition(t, duration, start, end, isSmooth=false)
{
	t /= duration;
	if (isSmooth)
		x = 0.5 - 0.5 * Math.cos(2 * Math.PI * 0.5 * t);
	else
		var x = t;
	
	var m = end - start;
	var C = start;

	if (t < 1)
		return m * x + C;
	else
		return end;
}

function circleTransition(t, duration, radius, centerX, centerY, isSmooth=false)
{
	t /= duration;
	if (isSmooth)
		x = 0.5 - 0.5 * Math.cos(2 * Math.PI * 0.5 * t);
	else
		x = t;
	
	if (x < 1)
		var angle = 2 * Math.PI * x;
	else
		var angle = 2 * Math.PI;
	
	var x = centerX + radius * Math.cos(angle);
	var y = centerY + radius * Math.sin(angle);
	
	return {x: Number(x.toFixed(8)), y: Number(y.toFixed(8)), angle: angle};
}

function grabFrame(framesArray)
{
	var img = new Image();
	img.src = renderer.domElement.toDataURL('image/png');
	framesArray.push(img)
}

function saveVideo(source, framesArray, isReset=false)
{
	if (saveVideo.canvas === undefined)
	{
		saveVideo.canvas = document.createElement("canvas");
		saveVideo.canvas.width = source.width;
		saveVideo.canvas.height = source.height;
	}

	if (isReset)
	{
		saveVideo.index = 0;
		startRecording(saveVideo.canvas);
	}
		
	var ctx = saveVideo.canvas.getContext("2d");
	ctx.clearRect(0, 0, saveVideo.canvas.width, saveVideo.canvas.height);
	var img = framesArray[saveVideo.index];
	ctx.drawImage(img, 0, 0);
	
	saveVideo.index++;
	if (saveVideo.index < framesArray.length)
		setTimeout(function () {saveVideo(source, framesArray)}, frameDuration);
	else
		stopRecording();
}
