
// Set chartData as a global variable for easy access
let chartData = [];

// Get all courses and extract majors
async function getAllCourses() {
  const allCourses = [];

  for (let i = 1; i <= 157; i++) {
    const url = `https://api.umd.io/v1/courses?page=${i}`;
    const response = await fetch(url);
    const courses = await response.json();
    allCourses.push(...courses);
  }

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

  // Get majors data
  const majors = filteredData

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


// Function to filter the chart data
function filterChartData(data, majorInput) {

  if (majorInput === "") {
    drawBarChart(data);
    return;
  }

  let filteredData = [];

  // Check if data is an array
  if (Array.isArray(data)) {
    filteredData = data.filter((item) => item.major === majorInput);
  }

  return filteredData;
}


// Call the fetchData function to retrieve the data from the API
getAllCourses();

// Add an event listener to the filter button
const filterButton = document.getElementById('data_filter');

filterButton.addEventListener('click', () => {
  const majorInput = document.getElementById('major').value;
  const filteredData = filterChartData(chartData, majorInput);
  filterBarChart(getAllCourses(filteredData));
});

// // Call function to draw chart
drawBarChart();

