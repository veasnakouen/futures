package com.mtp.api.controllers;

import com.mtp.api.models.Department;
import com.mtp.api.models.Employee;
import com.mtp.api.models.EmployeeCourse;
import com.mtp.api.models.EmployeeEnrollment;
import com.mtp.api.models.Position;
import com.mtp.api.repositories.DepartmentRepository;
import com.mtp.api.repositories.EmployeeCourseRepository;
import com.mtp.api.repositories.EmployeeEnrollmentRepository;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.PositionRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee-trainings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class EmployeeTrainingController {

    @Autowired
    private EmployeeCourseRepository courseRepository;

    @Autowired
    private EmployeeEnrollmentRepository enrollmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @PostConstruct
    public void seedInitialCourses() {
        // 1. Seed default department and position if they do not exist
        Department defaultDept = null;
        if (departmentRepository.count() == 0) {
            log.info("LMS Database: No departments found. Seeding default department...");
            Department dept = new Department();
            dept.setName("Human Resources");
            dept.setLocation("Main Office");
            defaultDept = departmentRepository.save(dept);
        } else {
            defaultDept = departmentRepository.findAll().get(0);
        }

        Position defaultPos = null;
        if (positionRepository.count() == 0) {
            log.info("LMS Database: No positions found. Seeding default position...");
            Position pos = new Position();
            pos.setName("Specialist");
            defaultPos = positionRepository.save(pos);
        } else {
            defaultPos = positionRepository.findAll().get(0);
        }

        // 2. Seed default employees if workforce is empty
        if (employeeRepository.count() == 0) {
            log.info("LMS Database: No employees found. Seeding default active staff...");

            Employee emp1 = new Employee();
            emp1.setIdNo("101");
            emp1.setTitle("Mr");
            emp1.setFirstNameEnglish("Sopheap");
            emp1.setLastNameEnglish("Keo");
            emp1.setFirstNameKhmer("សុភាព");
            emp1.setLastNameKhmer("កែវ");
            emp1.setEmail("sopheap.keo@mloptapang.org");
            emp1.setGender("Male");
            emp1.setStatus("Active");
            emp1.setContractType("UCD");
            emp1.setDepartment(defaultDept);
            emp1.setPosition(defaultPos);
            emp1.setJoinDate(LocalDate.now().minusYears(2));
            employeeRepository.save(emp1);

            Employee emp2 = new Employee();
            emp2.setIdNo("102");
            emp2.setTitle("Mrs");
            emp2.setFirstNameEnglish("Chantha");
            emp2.setLastNameEnglish("Vorn");
            emp2.setFirstNameKhmer("ចន្ថា");
            emp2.setLastNameKhmer("វន");
            emp2.setEmail("chantha.vorn@mloptapang.org");
            emp2.setGender("Female");
            emp2.setStatus("Active");
            emp2.setContractType("FDC");
            emp2.setDepartment(defaultDept);
            emp2.setPosition(defaultPos);
            emp2.setJoinDate(LocalDate.now().minusYears(1));
            employeeRepository.save(emp2);

            Employee emp3 = new Employee();
            emp3.setIdNo("103");
            emp3.setTitle("Mr");
            emp3.setFirstNameEnglish("Vannak");
            emp3.setLastNameEnglish("Meas");
            emp3.setFirstNameKhmer("វណ្ណៈ");
            emp3.setLastNameKhmer("មាស");
            emp3.setEmail("vannak.meas@mloptapang.org");
            emp3.setGender("Male");
            emp3.setStatus("Active");
            emp3.setContractType("UCD");
            emp3.setDepartment(defaultDept);
            emp3.setPosition(defaultPos);
            emp3.setJoinDate(LocalDate.now().minusMonths(6));
            employeeRepository.save(emp3);

            log.info("LMS Database: Seeding of active staff completed!");
        }

        // 3. Seed default compliance courses and initial enrollments
        if (courseRepository.count() == 0) {
            log.info("LMS Database: No courses found. Seeding default compliance courses...");

            // Cybersecurity Fundamentals
            EmployeeCourse course1 = new EmployeeCourse();
            course1.setTitle("Cybersecurity Fundamentals");
            course1.setProvider("Internal Compliance");
            course1.setDuration("2h 15m");
            course1.setDifficulty("Beginner");
            course1.setDescription("Protecting enterprise systems, credentials, and customer records from cyber threats and social engineering attacks.");
            course1.setChapters("[\"Chapter 1: Threat Landscape & Social Engineering\",\"Chapter 2: Strong Password Policies & Multi-Factor Auth\",\"Chapter 3: Screen Locking & Clean Desk Procedures\"]");
            course1.setQuiz("[{\"question\":\"What is the safest way to handle a suspected phishing email?\",\"options\":[\"Forward it to your colleagues to warn them.\",\"Click the links to check if they are real.\",\"Report it immediately to the IT support team.\",\"Ignore it and continue your duties.\"],\"answer\":2},{\"question\":\"Which of the following represents a secure credential practice?\",\"options\":[\"Using a personal dog's name followed by a simple number.\",\"Using a unique, long passphrase managed in a secure password manager.\",\"Writing administrative credentials on sticky notes under the keyboard.\",\"Sharing master passwords with teammates for convenience.\"],\"answer\":1}]");
            courseRepository.save(course1);

            // Advanced Social Work Ethics
            EmployeeCourse course2 = new EmployeeCourse();
            course2.setTitle("Advanced Social Work Ethics");
            course2.setProvider("Board of Ethics");
            course2.setDuration("8h 00m");
            course2.setDifficulty("Advanced");
            course2.setDescription("Professional boundaries, client confidentiality, and ethical decision-making frameworks in human services.");
            course2.setChapters("[\"Chapter 1: Professional Boundaries & Dual Relationships\",\"Chapter 2: Informed Consent & Disclosure Standards\",\"Chapter 3: Mandated Reporting & Risk Management\"]");
            course2.setQuiz("[{\"question\":\"What is the correct action if a client offers a high-value personal gift?\",\"options\":[\"Accept it immediately to avoid offending them.\",\"Accept it but donate it secretly to charity.\",\"Politely decline, explain the ethical boundary policy, and document the offer.\",\"Accept it only if no other clients or managers are watching.\"],\"answer\":2}]");
            courseRepository.save(course2);

            // Data Privacy & GDPR
            EmployeeCourse course3 = new EmployeeCourse();
            course3.setTitle("Data Privacy & GDPR");
            course3.setProvider("Global Standard");
            course3.setDuration("4h 30m");
            course3.setDifficulty("Intermediate");
            course3.setDescription("Understanding personal data governance, consent management, and storage compliance under GDPR frameworks.");
            course3.setChapters("[\"Chapter 1: GDPR Principles & Lawfulness of Processing\",\"Chapter 2: Individual Rights (Access, Erasure, Portability)\",\"Chapter 3: Data Breach Notification Protocols\"]");
            course3.setQuiz("[{\"question\":\"What should you do if client personal data is accidentally leaked?\",\"options\":[\"Cover it up and hope no one notices the leak.\",\"Notify your direct supervisor and the Data Protection Officer immediately.\",\"Wait for 30 days to see if any complaints are filed first.\",\"Apologize directly to the affected clients without reporting it internally.\"],\"answer\":1}]");
            courseRepository.save(course3);

            log.info("LMS Database: Default compliance courses seeded!");

            // Seed initial enrollments for active employees now that they are guaranteed to exist
            List<Employee> allEmployees = employeeRepository.findAll();
            if (!allEmployees.isEmpty()) {
                log.info("LMS Database: Seeding initial training enrollments for active employees...");
                
                Employee firstEmp = allEmployees.get(0);
                EmployeeEnrollment enroll1 = new EmployeeEnrollment();
                enroll1.setEmployee(firstEmp);
                enroll1.setCourse(course1);
                enroll1.setProgress(100);
                enroll1.setStatus("Completed");
                enroll1.setEnrolledAt(LocalDate.now().minusDays(15));
                enroll1.setCompletedAt(LocalDate.now().minusDays(12));
                enroll1.setDeadline(LocalDate.now().plusDays(15));
                enrollmentRepository.save(enroll1);

                if (allEmployees.size() > 1) {
                    Employee secondEmp = allEmployees.get(1);
                    EmployeeEnrollment enroll2 = new EmployeeEnrollment();
                    enroll2.setEmployee(secondEmp);
                    enroll2.setCourse(course2);
                    enroll2.setProgress(45);
                    enroll2.setStatus("In Progress");
                    enroll2.setEnrolledAt(LocalDate.now().minusDays(5));
                    enroll2.setDeadline(LocalDate.now().plusDays(25));
                    enrollmentRepository.save(enroll2);
                }

                log.info("LMS Database: Default enrollments successfully seeded!");
            }
        }
    }

    @GetMapping("/courses")
    public List<EmployeeCourse> getAllCourses() {
        log.info("LMS Database: Fetching all active training courses");
        return courseRepository.findAll();
    }

    @PostMapping("/courses")
    public EmployeeCourse createCourse(@RequestBody EmployeeCourse course) {
        log.info("LMS Database: Creating new training course - {}", course.getTitle());
        if (course.getChapters() == null || course.getChapters().trim().isEmpty()) {
            course.setChapters("[\"Chapter 1: Introduction\",\"Chapter 2: Best Practices\",\"Chapter 3: Review\"]");
        }
        if (course.getQuiz() == null || course.getQuiz().trim().isEmpty()) {
            course.setQuiz("[{\"question\":\"What is the compliance standard for this policy?\",\"options\":[\"None\",\"Ad-hoc updates\",\"Strict adherence & mandatory documentation\",\"Optional review\"],\"answer\":2}]");
        }
        return courseRepository.save(course);
    }

    @GetMapping("/enrollments")
    public List<EmployeeEnrollment> getAllEnrollments() {
        log.info("LMS Database: Fetching all active staff training enrollments");
        return enrollmentRepository.findAll();
    }

    @PostMapping("/enrollments")
    public EmployeeEnrollment enrollEmployee(@RequestParam Integer employeeId, @RequestParam Integer courseId, @RequestParam String deadline) {
        log.info("LMS Database: Enrolling employee ID {} in course ID {}", employeeId, courseId);
        
        Optional<Employee> empOpt = employeeRepository.findById(employeeId);
        if (!empOpt.isPresent()) {
            // Robust Fallback: If not found by primary key ID, search by idNo (e.g., "101", "102") to handle legacy fallback lists gracefully
            Optional<Employee> empByIdNo = employeeRepository.findByIdNo(String.valueOf(employeeId));
            if (empByIdNo.isPresent()) {
                empOpt = empByIdNo;
            } else {
                throw new IllegalArgumentException("Employee with ID or idNo " + employeeId + " does not exist.");
            }
        }

        Optional<EmployeeCourse> courseOpt = courseRepository.findById(courseId);
        if (!courseOpt.isPresent()) {
            throw new IllegalArgumentException("Course with ID " + courseId + " does not exist.");
        }

        Optional<EmployeeEnrollment> duplicate = enrollmentRepository.findByEmployeeIdAndCourseId(employeeId, courseId);
        if (duplicate.isPresent()) {
            throw new IllegalArgumentException("This staff member is already enrolled in this course.");
        }

        EmployeeEnrollment enrollment = new EmployeeEnrollment();
        enrollment.setEmployee(empOpt.get());
        enrollment.setCourse(courseOpt.get());
        enrollment.setProgress(0);
        enrollment.setStatus("Not Started");
        enrollment.setEnrolledAt(LocalDate.now());
        enrollment.setDeadline(LocalDate.parse(deadline));

        return enrollmentRepository.save(enrollment);
    }

    @PutMapping("/enrollments/{id}/progress")
    public EmployeeEnrollment updateProgress(@PathVariable Integer id, @RequestParam Integer progress, @RequestParam String status) {
        log.info("LMS Database: Updating progress for enrollment ID {} to {}% ({})", id, progress, status);
        
        Optional<EmployeeEnrollment> enrollOpt = enrollmentRepository.findById(id);
        if (!enrollOpt.isPresent()) {
            throw new IllegalArgumentException("Enrollment record not found.");
        }

        EmployeeEnrollment enrollment = enrollOpt.get();
        enrollment.setProgress(progress);
        enrollment.setStatus(status);
        if ("Completed".equalsIgnoreCase(status)) {
            enrollment.setCompletedAt(LocalDate.now());
        }

        return enrollmentRepository.save(enrollment);
    }

    @DeleteMapping("/enrollments/{id}")
    public void deleteEnrollment(@PathVariable Integer id) {
        log.info("LMS Database: Purging enrollment record ID - {}", id);
        enrollmentRepository.deleteById(id);
    }
}
