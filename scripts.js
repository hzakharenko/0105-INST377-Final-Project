
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

// Graph the 10 majors with the most course offerings
getAllCourses().then(() => {
  const ctx = document.getElementById('myChart2').getContext('2d');
  const sortedMajors = Object.entries(chartData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Get the top 10 majors by course count
  const labels = sortedMajors.map(major => major[0]);
  const data = sortedMajors.map(major => major[1]);

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Courses',
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});

// Graph the 10 majors with the least course offerings
getAllCourses().then(() => {
  const ctx = document.getElementById('myChart3').getContext('2d');
  const sortedMajors = Object.entries(chartData)
    .sort((a, b) => a[1] - b[1]) // Sort by the number of courses in ascending order
    .slice(0, 10); // Get the bottom 10 majors by course count
  const labels = sortedMajors.map(major => major[0]);
  const data = sortedMajors.map(major => major[1]);

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Courses',
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});

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
  //I am already filtering data using local storage by storing the initial chart input in a global variable
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
