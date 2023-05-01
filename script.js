// Define the chart canvas and context
const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');

// Call the API and store the data
async function fetchData() {
  const allCourses = [];

  for (let i = 1; i <= 157; i++) {
    const url = `https://api.umd.io/v1/courses?page=${i}`;
    const response = await fetch(url);
    const courses = await response.json();
    allCourses.push(...courses);
  }

  // Extract majors from courses
  const data = {};
  allCourses.forEach(course => {
    if (course.dept_id in data) {
      data[course.dept_id] += 1;
    } else {
      data[course.dept_id] = 1;
    }
  });
  chartData = data; // Store the data in the global variable
  return data;
}

// Render the initial chart
async function renderChart() {
  const data = await fetchData();
  const chartData = getChartData(data);
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
}

// Filter the data and update the chart
async function filterChartData() {
  const filterInput = document.getElementById('major');
  const filterValue = filterInput.value.trim().toUpperCase();
  const data = await fetchData();
  const filteredData = data.filter(course => course.major.toUpperCase() === filterValue);
  const chartData = getChartData(filteredData);
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  // Destroy the existing chart and render a new chart with the filtered data
  Chart.helpers.each(Chart.instances, function(instance) {
    instance.destroy();
  });
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
}

// Define the getChartData function
function getChartData(data) {
  const groupedData = data.reduce((acc, course) => {
    if (course.major !== "") {
      if (!acc[course.major]) {
        acc[course.major] = 0;
      }
      acc[course.major]++;
    }
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [{
      label: 'Number of Courses',
      data: Object.values(groupedData),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  return chartData;
}

// Add event listener for the filter button
const filterButton = document.getElementById('data-filter');
filterButton.addEventListener('click', filterChartData);

// Render the initial chart
renderChart();