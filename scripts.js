
// Set chartData as a global variable for easy access
let chartData = [];
let isFilterClicked = false;

// Get all courses and extract majors
async function getAllCourses() {
  const allCourses = [];

  for (let i = 1; i <= 157; i++) {
    const url = `https://api.umd.io/v1/courses?page=${i}`;
    const response = await fetch(url);
    const courses = await response.json();
    allCourses.push(...courses);
  }

  localStorage.setItem('storedData', JSON.stringify(allCourses));
  console.log('localStorage Check', localStorage.getItem('storedData'))
  // Extract majors from courses
  const majors = {};
  allCourses.forEach(course => {
    if (course.dept_id in majors) {
      majors[course.dept_id] += 1;
    } else {
      majors[course.dept_id] = 1;
    }
  });
  chartData = majors; // Store the data in the global variable
  console.log(majors)
  return majors;
}

// Draw bar chart of number of courses per major
async function drawBarChart() {
  // Get the canvas element
  const canvas = document.getElementById('myChart');

  // Get majors data
  const majors = await getAllCourses();

  // Check if a chart already exists
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  // Get chart data
  const chartData = {
    labels: Object.keys(majors),
    datasets: [
      {
        label: "Number of courses per major",
        data: Object.values(majors),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
  };

  // Get chart options
  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  // Get chart context
  const chartContext = document.getElementById("myChart").getContext("2d");

  // Create and render chart
  const chart = new Chart(chartContext, {
    type: "bar",
    data: chartData,
    options: chartOptions
  });
}

async function filterBarChart(filteredData) {
  // Get the canvas element
  const canvas = document.getElementById('myChart');

  // Make sure filtered data is being put in the chart
  const majors = filteredData
  console.log("The filtered data we will now represent in the bar chart is")
  console.log(majors)

  // Check if a chart already exists
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  // Get chart data
  const chartData = {
    labels: Object.keys(majors),
    datasets: [
      {
        label: "Number of courses per major",
        data: Object.values(majors),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
  };

  // Get chart options
  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  // Get chart context
  const chartContext = document.getElementById("myChart").getContext("2d");

  // Create and render chart
  const chart = new Chart(chartContext, {
    type: "bar",
    data: chartData,
    options: chartOptions
  });
}


function filterChartData(data, majorInput) {
  const input = document.getElementById("major").value.toUpperCase();

  if (input === "") {
    drawBarChart(data);
    return;
  }

  const filteredData = Object.entries(data)
    .filter(([key, value]) => key === input)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      console.log(obj)
      return obj;
    }, {});
  console.log(filteredData)
  filterBarChart(filteredData);
}



// Initial Data retrieval and chart load
chart = drawBarChart(getAllCourses());

// Add an event listener to the filter button
const filterButton = document.getElementById('data_filter');
const clearDataButton = document.querySelector('#data_clear');

filterButton.addEventListener('click', () => {
  const majorInput = document.getElementById('major').value;
  const filteredData = filterChartData(chartData, majorInput);
});

clearDataButton.addEventListener("click", (event) => {
  console.log('clear browser data');
  localStorage.clear();
  console.log('localStorage Check', localStorage.getItem('storedData'))

});

function removeData(chart) {
  chart.then(function (data) { chart.data.labels.pop(); chart.data.datasets.forEach((dataset) => { dataset.data.pop(); }); chart.update(); })
}
