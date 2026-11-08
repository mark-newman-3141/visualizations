function CreateGraphStructure(myCanvas, XAxis, YAxis)
{
	var XMin = XAxis[0];
	var XMax = XAxis[1];
	var XInterval = XAxis[2];
	
	var YMin = YAxis[0];
	var YMax = YAxis[1];
	var YInterval = YAxis[2];
	
	var myGraph = {
		Canvas: myCanvas,
		ctx: myCanvas.getContext("2d"),
		Title: "",
		GraphLeftMargin: 60,
		GraphRightMargin: 40,
		GraphLeft: 0,
		GraphTop: 0,
		GraphBottom: 0,
		GraphRight: 0,
		GraphWidth: 0,
		GraphHeight: 0,
		GridColor: "#DDDDDD",
		AxesColor: "black",
		YAxis_XCross: 0,
		GraphTopMargin: 30,
		GraphBottomMargin: 40,
		XMin: XMin,
		XMax: XMax,
		YMin: YMin,
		YMax: YMax,
		XInterval: XInterval,
		YInterval: YInterval,
		LogXScale: false,
		LogYScale: false,
		XGrid: true,
		YGrid: true,
		ShowGraphBorder: true,
		ShowAxes: true,
		XValues: true,
		YValues: true,
		XUnit: "",
		YUnit: "",
		AllowXAutoScale: false,
		AllowYAutoScale: false,
		XAutoScalePrecision: 1,
		YAutoScalePrecision: 2,
		AxisTickLabelsHeight: 10,
		XAxis_Label: "",
		YAxis_Label: "",
		XAxis_ScaleFactor: 1,
		YAxis_ScaleFactor: 1,
		Font: "Times New Roman",
		TitleHeight: 16,
		PointRadius: 3,
		lineWidth: 3,
		backgroundColor: "white",
		Series: [],
	};

	CalculateGraphDimensions(myGraph);
	
	return myGraph;
}

function CalculateGraphDimensions(myGraph)
{
	myGraph.GraphLeft = myGraph.GraphLeftMargin;
	myGraph.GraphTop = myGraph.GraphTopMargin;
	myGraph.GraphBottom = myGraph.Canvas.height - myGraph.GraphBottomMargin;
	myGraph.GraphRight = myGraph.Canvas.width - myGraph.GraphRightMargin;
	myGraph.GraphWidth = myGraph.GraphRight - myGraph.GraphLeft;
	myGraph.GraphHeight = myGraph.GraphBottom - myGraph.GraphTop;
}

function ChangeLeftBorderMargin(WhichGraph, newBorderMargin)
{
	WhichGraph.GraphLeftMargin = newBorderMargin;
	CalculateGraphDimensions(WhichGraph);
}

function ChangeRightBorderMargin(WhichGraph, newBorderMargin)
{
	WhichGraph.GraphRightMargin = newBorderMargin;
	CalculateGraphDimensions(WhichGraph);
}

function ChangeTopBorderMargin(WhichGraph, newBorderMargin)
{
	WhichGraph.GraphTopMargin = newBorderMargin;
	CalculateGraphDimensions(WhichGraph);
}

function ChangeBottomBorderMargin(WhichGraph, newBorderMargin)
{
	WhichGraph.GraphBottomMargin = newBorderMargin;
	CalculateGraphDimensions(WhichGraph);
}

function ResizeValueBox(elm)
{
	elm.style.height = elm.parentElement.offsetHeight + "px";
}

function Deg2Rad(Degrees)
{
	return Degrees * Math.PI / 180;
}

function Rad2Deg(Radians)
{
	return Radians * 180 / Math.PI;
}

function ShowBarSeries(WhichGraph, Data, Color)
{
	var X;
	var Y;
	
	for(Index=0; Index<Data.length; Index++)
	{
		X = XValue2Coord(WhichGraph, Data[Index].x);
		Y = YValue2Coord(WhichGraph, Data[Index].y);
		
		WhichGraph.ctx.strokeStyle = Color;
		WhichGraph.ctx.lineWidth = WhichGraph.lineWidth;
		
		WhichGraph.ctx.beginPath();
		WhichGraph.ctx.moveTo(X, YValue2Coord(WhichGraph, 0));
		WhichGraph.ctx.lineTo(X, Y);
		WhichGraph.ctx.stroke();
	}
}

function AddBobble(WhichGraph, Data, Color)
{
	var X;
	var Y;
	
	for(Index=0; Index<Data.length; Index++)
	{
		X = XValue2Coord(WhichGraph, Data[Index].x);
		Y = YValue2Coord(WhichGraph, Data[Index].y);
		
		WhichGraph.ctx.fillStyle = Color;
		WhichGraph.ctx.beginPath();
		WhichGraph.ctx.arc(X, Y, WhichGraph.PointRadius, 0, 2 * Math.PI);
		WhichGraph.ctx.fill();
	}
}

function ShowXYPoint(WhichGraph, Data, StrokeColor, FillColor)
{
	WhichGraph.ctx.strokeStyle = StrokeColor;
	WhichGraph.ctx.fillStyle = FillColor;
	WhichGraph.ctx.lineWidth = 1;

	for(Index=0; Index<Data.length; Index++)
	{
		X = XValue2Coord(WhichGraph, Data[Index].x);
		Y = YValue2Coord(WhichGraph, Data[Index].y);
			
		WhichGraph.ctx.beginPath();
		WhichGraph.ctx.arc(X, Y, WhichGraph.PointRadius, 0, 2 * Math.PI);
		WhichGraph.ctx.fill();
		
		WhichGraph.ctx.beginPath();
		WhichGraph.ctx.arc(X, Y, WhichGraph.PointRadius, 0, 2 * Math.PI);
		WhichGraph.ctx.stroke();
	}
}

function ShowXYSeries(WhichGraph, Data, Color)
{
	if (Data.length > 0)
	{
		var Index;
		var XLast = XValue2Coord(WhichGraph, Data[0].x);
		var YLast = YValue2Coord(WhichGraph, Data[0].y);
		var X;
		var Y;
		
		for(Index=0; Index<Data.length; Index++)
		{
			X = XValue2Coord(WhichGraph, Data[Index].x);
			Y = YValue2Coord(WhichGraph, Data[Index].y);
		
			WhichGraph.ctx.strokeStyle = Color;
			WhichGraph.ctx.lineWidth = WhichGraph.lineWidth;
			
		
			WhichGraph.ctx.beginPath();
			WhichGraph.ctx.moveTo(XLast, YLast);
			WhichGraph.ctx.lineTo(X, Y);
			WhichGraph.ctx.stroke();
			
			XLast = X;
			YLast = Y;
		}
	}
}

function ReDrawGraph(WhichGraph)
{
	CalculateGraphDimensions(WhichGraph);
	
	WhichGraph.ctx.clearRect(0, 0, WhichGraph.Canvas.width, WhichGraph.Canvas.height);
	
	if (WhichGraph.backgroundColor != "transparent")
	{
		WhichGraph.ctx.fillStyle = WhichGraph.backgroundColor;
		WhichGraph.ctx.fillRect(0, 0, WhichGraph.Canvas.width, WhichGraph.Canvas.height);
	}
	
	DrawGraphAxes(WhichGraph);
	
	var SeriesIndex;
	
	for (SeriesIndex=0; SeriesIndex<WhichGraph.Series.length; SeriesIndex++)
	{
		var Data = WhichGraph.Series[SeriesIndex].Data;
		var Color1 = WhichGraph.Series[SeriesIndex].Color1;
		var Color2 = WhichGraph.Series[SeriesIndex].Color2;
		var SeriesType = WhichGraph.Series[SeriesIndex].SeriesType;
		switch (SeriesType)
		{
			case "XYSeries":
				ShowXYSeries(WhichGraph, Data, Color1);
			break;
			case "XYPoint":
				ShowXYPoint(WhichGraph, Data, Color1, Color2);
			break;
			case "BarSeries":
			case "BarAndBobbleSeries":
				ShowBarSeries(WhichGraph, Data, Color1);
				
				if (SeriesType == "BarAndBobbleSeries")
					AddBobble(WhichGraph, Data, Color2);
			break;
		}
	}
}

function AxisAutoScale(WhichGraph, WhichAxis)
{
	var AllowAutoScale = eval("WhichGraph.Allow" + WhichAxis.toUpperCase() + "AutoScale")
	var AutoScalePrecision = eval("WhichGraph." + WhichAxis.toUpperCase() + "AutoScalePrecision");
	var AbsoluteMax=[];
	var AbsoluteMin=[];
	var Max=null;
	var Min=null;
	var formerYMin = WhichGraph.YMin;
	var formerYMax = WhichGraph.YMax;
	var formerYInterval = WhichGraph.YInterval;
	
	if (AllowAutoScale == true)
	{
		var GraphData = WhichGraph.Series[0].Data;
		var Data=[];
		
		for (var DataIndex=0; DataIndex<GraphData.length; DataIndex++)
			Data.push(eval("GraphData[DataIndex]." + WhichAxis.toLowerCase()));

		Data = Data.filter(function (value) {return !Number.isNaN(value);});
		Data = Data.filter(function (value) {return Number.isFinite(value);});
		
		if (Data.length>0)
		{
			AbsoluteMax.push(Math.max.apply(null,Data));
			AbsoluteMin.push(Math.min.apply(null,Data));
		}
		
		if (AbsoluteMax.length > 0)
			Max = Math.max.apply(null,AbsoluteMax);
		
		if (AbsoluteMin.length > 0)
			Min = Math.min.apply(null,AbsoluteMin);
		
		if (Max !== null)
		{
			if (Max == 0)
				var newPower = 0;
			else
				var newPower = Math.floor(Math.log10(Max)) - AutoScalePrecision + 1;
			
			var newMax = Max * Math.pow(10, -newPower);
			newMax = Math.ceil(newMax);
			newMax = newMax * Math.pow(10, newPower);
			newMax += WhichGraph.XAxis_ScaleFactor;
			
			switch (WhichAxis.toUpperCase())
			{
				case "X" :
					WhichGraph.XMax = newMax;
					WhichGraph.XInterval = (WhichGraph.XMax - WhichGraph.XMin) / 10;
				break;
				
				case "Y" :
					WhichGraph.YMax = newMax;
					WhichGraph.YInterval = (WhichGraph.YMax - WhichGraph.YMin) / 10;
				break;
			}
		}
		
		if (Min !== null)
		{
			if (Min == 0)
				var newPower = 0;
			else
				var newPower = Math.floor(Math.log10(Math.abs(Min))) - AutoScalePrecision;
			
			var newMin = Min * Math.pow(10, -newPower);
			newMin = Math.floor(newMin);
			newMin = newMin * Math.pow(10, newPower);
			
			switch (WhichAxis.toUpperCase())
			{
				case "X" :
					WhichGraph.XMin = newMin;
					WhichGraph.XInterval = (WhichGraph.XMax - WhichGraph.XMin) / 20;
				break;
				
				case "Y" :
					WhichGraph.YMin = newMin;
					WhichGraph.YInterval = (WhichGraph.YMax - WhichGraph.YMin) / 20;
				break;
			}
		}
		
		if (WhichGraph.XMax > 0)
		{
			if (WhichGraph.XMin > 0)
			{
				WhichGraph.XMin = 0;
				WhichGraph.XInterval = (WhichGraph.XMax - WhichGraph.XMin) / 20;
			}
		}
		else if (WhichGraph.XMin < 0)
		{
			if (WhichGraph.XMax < 0)
			{
				WhichGraph.XMax = 0;
				WhichGraph.XInterval = (WhichGraph.XMax - WhichGraph.XMin) / 20;
			}
		}

		if (WhichGraph.YMax > 0)
		{
			if (WhichGraph.YMin > 0)
			{
				WhichGraph.YMin = 0;
				WhichGraph.YInterval = (WhichGraph.YMax - WhichGraph.YMin) / 20;
			}
		}
		else if (WhichGraph.YMin < 0)
		{
			if (WhichGraph.YMax < 0)
			{
				WhichGraph.YMax = 0;
				WhichGraph.YInterval = (WhichGraph.YMax - WhichGraph.YMin) / 20;
			}
		}
		
		if (Math.abs(WhichGraph.YMax - WhichGraph.YMin) < 0.01)
		{
			WhichGraph.YMax = formerYMax;
			WhichGraph.YMin = formerYMin;
			WhichGraph.YInterval = formerYInterval;
		}
	}
}

// Series Functions
function CreateSeries(WhichGraph, newSeriesType, newColor1, newColor2, newIsShown)
{
	var newData=[];
	var newSeries={SeriesType: newSeriesType, Data: newData, Color1: getColorString(newColor1), Color2: getColorString(newColor2), IsShown: newIsShown};
	WhichGraph.Series.push(newSeries);
	ReDrawGraph(WhichGraph);
}

function ChangeSeriesData(WhichGraph, SeriesIndex, Data)
{
	WhichGraph.Series[SeriesIndex].Data = [];
	
	for (var i=0; i<Data.length; i++)
	{
		WhichGraph.Series[SeriesIndex].Data.push({x: 0, y: 0, f: 0});
		if (WhichGraph.XAxis_ScaleFactor == 1)
			WhichGraph.Series[SeriesIndex].Data[i].x = Data[i].x;
		else
			WhichGraph.Series[SeriesIndex].Data[i].x = Data[i].x * WhichGraph.XAxis_ScaleFactor;
		
		if (WhichGraph.YAxis_ScaleFactor == 1)
			WhichGraph.Series[SeriesIndex].Data[i].y = Data[i].y;
		else
			WhichGraph.Series[SeriesIndex].Data[i].y = Data[i].y * WhichGraph.YAxis_ScaleFactor;
		
		WhichGraph.Series[SeriesIndex].Data[i].f = Data[i].f;
	}
	AxisAutoScale(WhichGraph, "X");
	AxisAutoScale(WhichGraph, "Y");
	ReDrawGraph(WhichGraph);
}

function getSeriesData(WhichGraph, SeriesIndex)
{
	Data = [];
	
	for (var i=0; i<WhichGraph.Series[SeriesIndex].Data.length; i++)
	{
		var x;
		var y;
		
		if (WhichGraph.XAxis_ScaleFactor == 1)
			x = WhichGraph.Series[SeriesIndex].Data[i].x;
		else
			x = WhichGraph.Series[SeriesIndex].Data[i].x / WhichGraph.XAxis_ScaleFactor;
		
		if (WhichGraph.YAxis_ScaleFactor == 1)
			y = WhichGraph.Series[SeriesIndex].Data[i].y;
		else
			y = WhichGraph.Series[SeriesIndex].Data[i].y / WhichGraph.YAxis_ScaleFactor;

		var f = WhichGraph.Series[SeriesIndex].Data[i].f;
		Data.push({x: x, y: y, f: f});
	}
	
	return Data;
}

function RemoveSeries(WhichGraph, SeriesIndex)
{
	WhichGraph.Series.splice(SeriesIndex, 1);
	ReDrawGraph(WhichGraph);
}

function getColorString(ColorText)
{
	return "rgba(" + ColorText + ")";
}

function ShowHideSeries(WhichGraph, SeriesIndex, newIsShown)
{
	var newSeries = WhichGraph.Series[SeriesIndex];
	newSeries.IsShown = newIsShown;
	ReDrawGraph(WhichGraph);
}

function ChangeSeriesOpacity(WhichGraph, SeriesIndex, newOpacity)
{
	var newSeries = WhichGraph.Series[SeriesIndex];
	
	if (newOpacity == 0)
		newSeries.IsShown = false;
	else
		newSeries.IsShown = true;
		
	newSeries.Color1 = EditOpacity(newSeries.Color1, newOpacity);
	newSeries.Color2 = EditOpacity(newSeries.Color2, newOpacity);
	ReDrawGraph(WhichGraph);
}

function ChangeSeriesColor(WhichGraph, SeriesIndex, newColor)
{
	var newSeries = WhichGraph.Series[SeriesIndex];
	
	var Opacity = newColor.split(",")[3];
	
	newSeries.Color1 = EditOpacity(newColor, Opacity);
	newSeries.Color2 = EditOpacity(newColor, Opacity);
	ReDrawGraph(WhichGraph);
}

function EditOpacity(Color, Opacity) 
{
	var myColorArray = Color.split(",");
	var ColorPattern="Red,Green,Blue,Alpha";
	
	if (myColorArray.length == 4)
		Output = ColorPattern.split("Red").join(myColorArray[0]).split("Green").join(myColorArray[1]).split("Blue").join(myColorArray[2]).split("Alpha").join(Opacity);
	else
		Output = "";
	
	return Output;
}

function DrawGraphAxes(WhichGraph)
{
	ShowGraphTitle(WhichGraph);
	DrawGraphBorder(WhichGraph);
	if (WhichGraph.ShowAxes == true)
	{
		DrawXAxes(WhichGraph);
		DrawYAxes(WhichGraph);
	}
}

function ShowGraphTitle(WhichGraph)
{
	var Text = WhichGraph.Title;
	
	WhichGraph.ctx.fillStyle = WhichGraph.AxesColor;
	WhichGraph.ctx.font = WhichGraph.TitleHeight + "pt " + WhichGraph.Font;
	WhichGraph.ctx.fillText(Text, WhichGraph.Canvas.width / 2 - WhichGraph.ctx.measureText(Text).width / 2, WhichGraph.TitleHeight + 10);
}

function DrawGraphBorder(WhichGraph)
{
	if (WhichGraph.ShowGraphBorder == true)
	{
		// Graph Border
		WhichGraph.ctx.strokeStyle = "#AAAAAA";
		WhichGraph.ctx.lineWidth = 1;
		
		WhichGraph.ctx.beginPath();
		WhichGraph.ctx.moveTo(WhichGraph.GraphLeft, WhichGraph.GraphTop);
		WhichGraph.ctx.lineTo(WhichGraph.GraphRight, WhichGraph.GraphTop);
		WhichGraph.ctx.lineTo(WhichGraph.GraphRight, WhichGraph.GraphBottom);
		WhichGraph.ctx.lineTo(WhichGraph.GraphLeft, WhichGraph.GraphBottom);
		WhichGraph.ctx.lineTo(WhichGraph.GraphLeft, WhichGraph.GraphTop);
		WhichGraph.ctx.stroke();
	}
}

function DrawXAxes(WhichGraph)
{
	if (WhichGraph.LogXScale == true)
		var XTick = 1;
	else
		var XTick = WhichGraph.XMin;
	
	var Text;
	
	WhichGraph.ctx.strokeStyle = WhichGraph.AxesColor;
	WhichGraph.ctx.lineWidth = 1;

	WhichGraph.ctx.beginPath();
	WhichGraph.ctx.moveTo(XValue2Coord(WhichGraph, WhichGraph.XMin), YValue2Coord(WhichGraph, 0));
	WhichGraph.ctx.lineTo(XValue2Coord(WhichGraph, WhichGraph.XMax), YValue2Coord(WhichGraph, 0));
	WhichGraph.ctx.stroke();
	
	while (XTick <= WhichGraph.XMax)
	{
		//if (XTick != 0)
		//{
			WhichGraph.ctx.strokeStyle = WhichGraph.GridColor;
			console.log(WhichGraph.GridColor)
			WhichGraph.ctx.lineWidth = 1;
			
			if (WhichGraph.XGrid == true)
			{
				WhichGraph.ctx.beginPath();
				WhichGraph.ctx.moveTo(XValue2Coord(WhichGraph, XTick), YValue2Coord(WhichGraph, WhichGraph.YMin));
				WhichGraph.ctx.lineTo(XValue2Coord(WhichGraph, XTick), YValue2Coord(WhichGraph, WhichGraph.YMax));
				WhichGraph.ctx.stroke();
			}

			WhichGraph.ctx.strokeStyle = WhichGraph.AxesColor;
			WhichGraph.ctx.fillStyle = WhichGraph.AxesColor;
			WhichGraph.ctx.lineWidth = 1;		
			
			WhichGraph.ctx.beginPath();
			WhichGraph.ctx.moveTo(XValue2Coord(WhichGraph, XTick), YValue2Coord(WhichGraph, 0) - 5);
			WhichGraph.ctx.lineTo(XValue2Coord(WhichGraph, XTick), YValue2Coord(WhichGraph, 0) + 5);
			WhichGraph.ctx.stroke();
		//}
		
		if (WhichGraph.XValues == true)
		{
			Text = XTick.toLocaleString() + WhichGraph.XUnit;
			WhichGraph.ctx.font = WhichGraph.AxisTickLabelsHeight + "pt " + WhichGraph.Font;
			WhichGraph.ctx.fillText(Text, XValue2Coord(WhichGraph, XTick) - WhichGraph.ctx.measureText(Text).width / 2, YValue2Coord(WhichGraph, 0) + 10 + WhichGraph.AxisTickLabelsHeight);
		}
		
		if (WhichGraph.LogXScale == true)
			XTick *= 10;
		else
			XTick += WhichGraph.XInterval;
		
		XTick = Number(XTick.toFixed(8));
	}
	
	Text = WhichGraph.XAxis_Label;
	WhichGraph.ctx.textAlign = "center"
	WhichGraph.ctx.font = Number(WhichGraph.AxisTickLabelsHeight) + "pt " + WhichGraph.Font;
	//var X = XValue2Coord(WhichGraph, (WhichGraph.XMin + (WhichGraph.XMax - WhichGraph.XMin) / 2)) - WhichGraph.ctx.measureText(Text).width / 2;
	var X = WhichGraph.GraphLeft + ((WhichGraph.GraphRight - WhichGraph.GraphLeft) / 2);
	
	if (WhichGraph.YMin < 0)
		var Y = YValue2Coord(WhichGraph, WhichGraph.YMin) + 10 + WhichGraph.AxisTickLabelsHeight;
	else
		var Y = YValue2Coord(WhichGraph, WhichGraph.YMin) + 15 + WhichGraph.AxisTickLabelsHeight + WhichGraph.AxisTickLabelsHeight;
	
	WhichGraph.ctx.fillText(Text, X, Y);
	WhichGraph.ctx.textAlign = "left"
}

function DrawYAxes(WhichGraph)
{
	var YTick = WhichGraph.YMin;
	var Text;
	var X;
	var Y;
	
	WhichGraph.ctx.strokeStyle = WhichGraph.AxesColor;
	WhichGraph.ctx.lineWidth = 1;

	WhichGraph.ctx.beginPath();
	WhichGraph.ctx.moveTo(XValue2Coord(WhichGraph, WhichGraph.YAxis_XCross), YValue2Coord(WhichGraph, WhichGraph.YMin));
	WhichGraph.ctx.lineTo(XValue2Coord(WhichGraph, WhichGraph.YAxis_XCross), YValue2Coord(WhichGraph, WhichGraph.YMax));
	WhichGraph.ctx.stroke();
	
	while (YTick <= WhichGraph.YMax)
	{
		if (YTick != 0)
		{
			WhichGraph.ctx.strokeStyle = WhichGraph.GridColor;
			WhichGraph.ctx.lineWidth = 1;
			
			if (WhichGraph.YGrid == true)
			{
				WhichGraph.ctx.beginPath();
				WhichGraph.ctx.moveTo(XValue2Coord(WhichGraph, WhichGraph.XMin), YValue2Coord(WhichGraph, YTick));
				WhichGraph.ctx.lineTo(XValue2Coord(WhichGraph, WhichGraph.XMax), YValue2Coord(WhichGraph, YTick));
				WhichGraph.ctx.stroke();
			}
			
			WhichGraph.ctx.strokeStyle = WhichGraph.AxesColor;
			WhichGraph.ctx.lineWidth = 1;		
			
			
			WhichGraph.ctx.beginPath();
			WhichGraph.ctx.moveTo(XValue2Coord(WhichGraph, WhichGraph.YAxis_XCross) - 5, YValue2Coord(WhichGraph, YTick));
			WhichGraph.ctx.lineTo(XValue2Coord(WhichGraph, WhichGraph.YAxis_XCross) + 5, YValue2Coord(WhichGraph, YTick));
			WhichGraph.ctx.stroke();
			
			if (WhichGraph.YValues == true)
			{
				if (YTick > 1e6)
					Text = YTick.toExponential(2) + WhichGraph.YUnit;
				else
					Text = YTick.toLocaleString() + WhichGraph.YUnit;
				
				
				WhichGraph.ctx.font = WhichGraph.AxisTickLabelsHeight + "pt " + WhichGraph.Font;
				X = XValue2Coord(WhichGraph, WhichGraph.YAxis_XCross) - WhichGraph.ctx.measureText(Text).width - 10;
				Y = YValue2Coord(WhichGraph, YTick) + WhichGraph.AxisTickLabelsHeight/2;
				WhichGraph.ctx.fillText(Text, X, Y);
			}
		}
		
		YTick += WhichGraph.YInterval;
		YTick = Number(YTick.toFixed(2));
	}
	
	Text = WhichGraph.YAxis_Label;
	WhichGraph.ctx.font = Number(WhichGraph.AxisTickLabelsHeight) + "pt " + WhichGraph.Font;
	WhichGraph.ctx.textAlign = "center";
	var x = WhichGraph.AxisTickLabelsHeight;
	var y = YValue2Coord(WhichGraph, WhichGraph.YMin + (WhichGraph.YMax - WhichGraph.YMin) / 2);
	WhichGraph.ctx.translate(x, y);
	WhichGraph.ctx.rotate(-Math.PI/2);
	WhichGraph.ctx.fillText(Text, 0, WhichGraph.AxisTickLabelsHeight/2);
	WhichGraph.ctx.textAlign = "left";
	WhichGraph.ctx.rotate(Math.PI/2);
	WhichGraph.ctx.translate(-x, -y);
	
}

function XValue2Coord(WhichGraph, XValue)
{
	if (WhichGraph.LogXScale == true)
	{
		if (WhichGraph.XMin != 0)
			var XMin = Math.log10(WhichGraph.XMin);
		else
			var XMin = 0;
		
		if (WhichGraph.XMax != 0)
			var XMax = Math.log10(WhichGraph.XMax);
		else
			var XMax = 0;
		
		if (XValue != 0)
			var logValue = Math.log10(XValue);
		else
			var logValue = 0;

		var GraphXRange = XMax - XMin;
		var Coord = WhichGraph.GraphLeft + WhichGraph.GraphWidth * (logValue - XMin) / GraphXRange;
		return Coord;
	}
	else
	{
		var GraphXRange = WhichGraph.XMax - WhichGraph.XMin;
		return WhichGraph.GraphLeft + WhichGraph.GraphWidth * (XValue - WhichGraph.XMin) / GraphXRange;
	}
}

function XCoord2Value(WhichGraph, XCoord)
{
	var GraphXRange = WhichGraph.XMax - WhichGraph.XMin;
	return  WhichGraph.XMin + GraphXRange * (XCoord - WhichGraph.GraphLeft) / WhichGraph.GraphWidth;
}

function YValue2Coord(WhichGraph, YValue)
{
	if (WhichGraph.LogYScale == true)
	{
		var GraphYRange = Math.log10(WhichGraph.YMax) - Math.log10(WhichGraph.YMin);
		return WhichGraph.GraphBottom - WhichGraph.GraphHeight * (Math.log10(YValue) - Math.log10(WhichGraph.YMin)) / GraphYRange;
	}
	else
	{
		var GraphYRange = WhichGraph.YMax - WhichGraph.YMin;
		return WhichGraph.GraphBottom - WhichGraph.GraphHeight * (YValue - WhichGraph.YMin) / GraphYRange;
	}
}	

function YCoord2Value(WhichGraph, YCoord)
{
	var GraphYRange = WhichGraph.YMax - WhichGraph.YMin;
	return  WhichGraph.YMin - GraphYRange * (YCoord - WhichGraph.GraphBottom) / WhichGraph.GraphHeight;
}

function onMouseOver(elm)
{
	var div = document.createElement("div");
	div.id = "coordinateContainer";
	elm.parentElement.insertBefore(div, elm);
	div.style.position = "relative";
	
	var Coordinate = document.createElement("div");
	Coordinate.id = "Coordinate";
	div.appendChild(Coordinate);
	Coordinate.style.display = "none";
	Coordinate.style.position = "absolute";
	Coordinate.style.backgroundColor = "#4B371C";
	Coordinate.style.borderRadius = "5px";
	Coordinate.style.padding = "3px";
}

function onMouseMove(elm, evt, isColeCole=false)
{
	var WhichGraph = eval(elm.id.replace("Canvas", "Graph"));
	var seriesIndex = WhichGraph.Series.length - 1;
	var data = getSeriesData(WhichGraph, 0);
	var xTolerance = 10;
	var yTolerance = xTolerance * WhichGraph.Canvas.height / WhichGraph.Canvas.width;
	var isXAutoScale = [WhichGraph.AllowXAutoScale, WhichGraph.AllowYAutoScale];
	WhichGraph.AllowXAutoScale = false;
	WhichGraph.AllowYAutoScale = false;
	
	if (data.length > 0)
	{
		var xValue = XCoord2Value(WhichGraph, evt.offsetX) / WhichGraph.XAxis_ScaleFactor;
		var xInterval = WhichGraph.XInterval / WhichGraph.XAxis_ScaleFactor;
		var xLowerLimit = xValue - xInterval / xTolerance;
		var xUpperLimit = xValue + xInterval / xTolerance;

		var yValue = YCoord2Value(WhichGraph, evt.offsetY) / WhichGraph.YAxis_ScaleFactor;
		var yInterval = WhichGraph.YInterval / WhichGraph.YAxis_ScaleFactor;
		var yLowerLimit = yValue - yInterval / yTolerance;
		var yUpperLimit = yValue + yInterval / yTolerance;

		var found = data.find(element => (element.x >= xLowerLimit) && (element.x < xUpperLimit) && (element.y >= yLowerLimit) && (element.y < yUpperLimit));
		var showPopup = false;
		if (found !== undefined)
		{
			showPopup = true;
		}
		
		if (showPopup == true)
		{
			if (Coordinate.style.display != "")
			{
				Coordinate.style.display = "";
				Coordinate.style.left = Number(evt.offsetX + 5) + "px";
				Coordinate.style.bottom = Number(-evt.offsetY + 5) + "px";
				var xLabel = WhichGraph.XAxis_Label.split(" ")[0];
				var getXUnit = WhichGraph.XAxis_Label.split("(");
				
				if (getXUnit.length > 1)
					var xUnit = "<span style='font-size: 80%'> " + getXUnit[1].replace(")","") + "</span>";
				else
					var xUnit = "";
				
				var yLabel = WhichGraph.YAxis_Label.split(" ")[0];
				var getYUnit = WhichGraph.YAxis_Label.split("(");
				
				if (getYUnit.length > 1)
				var yUnit = "<span style='font-size: 80%'> " + WhichGraph.YAxis_Label.split("(")[1].replace(")","") + "</span>";
				else
					var yUnit = "";
				
				var FrequencyRow="";
				if (isColeCole == true)
				{
					FrequencyRow =	"<tr>" + 
									"	<th align='right'>Frequency: </th><td>" + found.f + "<span style='font-size: 80%'> Hz</span></td>" +
									"</tr>";
				}
				
				Coordinate.innerHTML =	"<table style='color: white;'>" + 
										"<tr>" + 
										"	<th align='right'>" + xLabel + ": </th><td>" + Number(found.x * WhichGraph.XAxis_ScaleFactor).toLocaleString() + xUnit + "</td>" + 
										"</tr>" +
										"<tr>" + 									
										"<tr>" + 
										"	<th align='right'>" + yLabel + ": </th><td>" + Number(found.y * WhichGraph.YAxis_ScaleFactor).toLocaleString() + yUnit + "</td>" +
										"</tr>" + 
										FrequencyRow +
										"</table>";

				ChangeSeriesData(WhichGraph, seriesIndex, [{x: found.x, y: found.y}]);
			}
		}
		else
		{
			if (Coordinate.style.display != "none")
			{
				Coordinate.style.display = "none";
				ChangeSeriesData(WhichGraph, seriesIndex, []);
			}
		}
	}
	
	WhichGraph.AllowXAutoScale = isXAutoScale[0];
	WhichGraph.AllowYAutoScale = isXAutoScale[1];
}

function onMouseOut(elm)
{
	elm.parentElement.removeChild(coordinateContainer);
}

function arrow(ctx, x, y, angle, length, scale)
{
	angle *= Math.PI / 180;
	ctx.beginPath();
	ctx.translate(x, y);
	ctx.rotate(-angle);
	ctx.moveTo(0, 0);
	ctx.lineTo(-length, -length * scale);
	ctx.lineTo(-length, +length * scale);
	ctx.lineTo(0, 0);
	ctx.fill();
	
	ctx.rotate(angle);
	ctx.translate(-x, -y);
}
