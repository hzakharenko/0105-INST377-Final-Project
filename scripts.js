// Get all courses and extract majors
async function getAllCourses() {
  const allCourses = [];

  for (let i = 1; i <= 157; i++) {
    const url = `https://api.umd.io/v0/courses?page=${i}`;
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

  return majors;
}

// Draw bar chart of number of courses per major
async function drawBarChart() {
  // Get majors data
  const majors = await getAllCourses();

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

// Call function to draw chart
drawBarChart();
