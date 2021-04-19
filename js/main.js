
const width = 750, height = 366;
const margin = ({top: 20, right: 20, bottom: 30, left: 40});

const thr = [120, 72];

const captionX = ["Height in cm","Weight in kg"];
const chartClass = ["height-chart", "weight-chart"];
const columnData = ["height", "weight"];
const barColor = ["#16A", "#957"];

columnData.forEach( (cd, i) => {
    
    d3.csv('./js/height_weight.csv', d => {
        return +d[cd] * (i < 1 ? 2.54 : 0.454)
        
    }).then((data) => {
        //console.log(data);
        
        const dataTable = Object.assign(data, {x: captionX[i], y: "Frequency"});
        const bins = d3.bin().thresholds(thr[i])(dataTable);
        
        let x = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length - 1].x1])
        .range([margin.left, width - margin.right]);

        let y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 30 ).tickSizeOuter(0))
        .call(g => g.append("text")
            .attr("x", width - margin.right)
            .attr("y", -15)
            .attr("fill", "currentColor")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(dataTable.x));
        
    const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 20))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(dataTable.y));

    const svg = d3.create("svg")
    .attr("class", chartClass[i])
        .attr("viewBox", [0, 0, width, height]);
        
    svg.append("g")
        .attr("fill", barColor[i])
        .selectAll("rect")
        .data(bins)
        .join("rect")
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", d => y(d.length))
            .attr("height", d => y(0) - y(d.length));
            
            svg.append("g")
            .call(xAxis);
            
            svg.append("g")
            .call(yAxis);
            
            let chart = svg.node();    
            
            // bins.forEach( (e,i,a) =>  console.log(a.length, e) );
            
            document.getElementById('root').appendChild(chart);
            
        });
        
    } );
