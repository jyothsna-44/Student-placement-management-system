// src/main/java/PlacementServer.java
import static spark.Spark.*;
import com.google.gson.Gson;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.List;

public class PlacementServer {

    // --- Data Models ---
    // These simple classes represent our data structures.

    static class Student {
        int id;
        String name;
        String major;
        String placementStatus = "Not Placed"; // Default status

        Student(int id, String name, String major) {
            this.id = id;
            this.name = name;
            this.major = major;
        }
    }

    static class Company {
        int id;
        String name;
        String industry;

        Company(int id, String name, String industry) {
            this.id = id;
            this.name = name;
            this.industry = industry;
        }
    }

    // --- In-Memory Database ---
    // We use thread-safe lists to store our data.
    private static List<Student> students = new CopyOnWriteArrayList<>();
    private static List<Company> companies = new CopyOnWriteArrayList<>();
    private static AtomicInteger nextStudentId = new AtomicInteger(1);
    private static AtomicInteger nextCompanyId = new AtomicInteger(1);

    public static void main(String[] args) {
        Gson gson = new Gson();

        // Serve the frontend files from the 'public' folder
        staticFiles.location("/public");

        // --- API ENDPOINTS ---

        // == Student Endpoints ==
        // GET: Fetch all students
        get("/api/students", (req, res) -> students, gson::toJson);

        // POST: Add a new student
        post("/api/students", (req, res) -> {
            Student student = gson.fromJson(req.body(), Student.class);
            student.id = nextStudentId.getAndIncrement();
            students.add(student);
            return student;
        }, gson::toJson);

        // == Company Endpoints ==
        // GET: Fetch all companies
        get("/api/companies", (req, res) -> companies, gson::toJson);

        // POST: Add a new company
        post("/api/companies", (req, res) -> {
            Company company = gson.fromJson(req.body(), Company.class);
            company.id = nextCompanyId.getAndIncrement();
            companies.add(company);
            return company;
        }, gson::toJson);

        // == Placement Endpoint ==
        // POST: Assign a student to a company
        post("/api/placements", (req, res) -> {
            // Read IDs from the request URL (e.g., /api/placements?studentId=1&companyId=2)
            int studentId = Integer.parseInt(req.queryParams("studentId"));
            int companyId = Integer.parseInt(req.queryParams("companyId"));

            // Find the company name
            String companyName = companies.stream()
                .filter(c -> c.id == companyId)
                .findFirst()
                .map(c -> c.name)
                .orElse("Unknown Company");

            // Find the student and update their status
            for (Student student : students) {
                if (student.id == studentId) {
                    student.placementStatus = "Placed at " + companyName;
                    return student; // Return the updated student
                }
            }
            return "{\"error\":\"Student not found\"}"; // Or handle error appropriately
        }, gson::toJson);
    }
}