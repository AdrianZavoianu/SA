const width = 960
const height = 420

const svg = d3.select("#map-svg")
            .attr("width", width)
            .attr("height", height);

const tooltip = d3.select("#tooltip");

const projection = d3.geoMercator()
                .center([-21, -15]) // Center the map over South America
                .scale(400)
                .translate([width / 2, height / 2])

const path = d3.geoPath().projection(projection)

d3.json("data/south-america.geojson").then(function(data) {
    svg.selectAll("path")
       .data(data.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("stroke-width", 2)
       .attr("fill", function(d) {
            // Check the country name and color accordingly
            if (d.properties.name === 'Peru' || 
                d.properties.name === 'Colombia' || 
                d.properties.name === 'Brazil' || 
                d.properties.name === 'Chile' || 
                d.properties.name === 'Argentina') {
                return "#4CAF50"; // Specific countries in light green rgba(0, 200, 83,0.2) rgba(76, 175, 80,0.2)
            }
            return "lightgray"; // Other countries
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            if (['Peru', 'Colombia', 'Brazil', 'Chile', 'Argentina'].includes(d.properties.name)) {
                d3.select(this).style("fill", "rgba(76, 175, 80,0.5)");
                tooltip.style("visibility", "visible")
                   .html(`<img src="images/${d.properties.name}.svg" alt="Flag of ${d.properties.name}" style="width: 20px; margin-bottom:4px; vertical-align: middle;"> ${d.properties.name}`)
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY + 10) + "px");
            }
        })

        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY + 10) + "px");
        })

        .on("mouseout", function(event, d) {
            tooltip.style("visibility", "hidden");
            if (['Peru', 'Colombia', 'Brazil', 'Chile', 'Argentina'].includes(d.properties.name)) {
                d3.select(this).style("fill", "#4CAF50");
            }})
        
        .on("click", function(event, d) {
            openModal(d);
        });
})

document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('nav a');
    var currentUrl = window.location.pathname.split('/').pop();

    links.forEach(link => {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('active');
        }
    });
});

// Close the modal when the 'x' is clicked
document.getElementById("closeModal").onclick = function() {
    document.getElementById("countryModal").style.display = "none";
}

let countriesDescriptions={
    "Brazil":"Brazil, a country of immense size and cultural richness, is known for its lively festivals, especially the world-famous Rio Carnival.",
    "Argentina":"Argentina, the land of the tango, is a country that captivates with its passion for dance, delicious cuisine, and awe-inspiring landscapes.",
    "Peru":"Peru, a land steeped in ancient history, beckons travelers with its archaeological wonders and diverse landscapes",
    "Chile":"Chile, stretching along the western edge of South America, boasts a remarkable diversity of landscapes.",
    "Colombia":"Colombia is a country that has transcended its tumultuous past to become a vibrant destination."
}

// Function to open the modal with specific country info
function openModal(country) {
    var modal = document.getElementById("countryModal");
    document.getElementById("countryName").textContent = country.properties.name;
    document.getElementById("countryInfo").textContent = countriesDescriptions[country.properties.name];
    document.getElementById("countryImage").src = "images/" + country.properties.name.toLowerCase() + ".jpg"; 
    document.getElementById("readMoreLink").href =country.properties.name.toLowerCase() + ".html"; 
    
    modal.style.display = "block";
}