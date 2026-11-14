YOGDAN
Connecting Donors, Saving Lives.
CAPSTONE PROJECT
SYSTEM DESIGN & RESEARCH DOCUMENT
A location-aware blood donation and coordination ecosystem
Project documentation for research, development and academic presentation

Document Overview
This document defines the proposed scope, user journeys, system architecture, matching logic, platform responsibilities, technology options and implementation roadmap for Yogdan. It is intended to be a practical starting point for the capstone team. Features are separated into the minimum viable product (MVP) and later enhancements so that the project remains achievable.
Document item
Description
Project name
Yogdan
Tagline
Connecting Donors, Saving Lives.
Project type
Blood donation discovery, request and coordination platform
Primary users
Donors, recipients/requesters, hospitals and authorized hospital staff
Platform ecosystem
Donor/recipient app or web app, hospital web dashboard, public landing website
Initial geographic focus
Pilot within a defined service area; configurable radius-based matching
Document status
Initial system proposal – details to be validated during R&D


1. Project Introduction
Yogdan is a technology-enabled blood donation and donor-connectivity platform designed to reduce the time and effort required to connect people who need blood with potential voluntary donors in their nearby locations. It acts as a digital bridge between recipients, donors and participating hospitals through a shared, interconnected system.
A person who creates an account can register as a potential donor by default, subject to providing the required profile information and confirming their willingness to be contacted. If that person or someone they are helping needs blood, they can create a blood request on behalf of themselves or another recipient. Yogdan then identifies potential donors around the request location and sends notifications in controlled geographical stages rather than alerting every donor across an entire city at once.
The hospital dashboard complements the app by allowing authorized hospital users to view relevant donor and request information, create requests on behalf of a patient, monitor responses and coordinate contact with potential donors. A public landing website explains the project and provides access to the app and hospital portal.
2. Problem Statement
During medical treatment, planned procedures or emergencies, patients and their families may need to locate a suitable blood donor within a limited period. They often rely on personal contacts, social media groups, phone calls or informal networks. These methods can be fragmented, difficult to search and slow to coordinate.
There may be no single, organized way to discover potential donors near the hospital or recipient.
Requests shared too broadly can create notification fatigue and reduce the likelihood that people respond.
Donor information, availability and contact details may be outdated or scattered across multiple sources.
Hospitals may have difficulty identifying and coordinating with community donors outside their existing contact networks.
People who voluntarily donate blood may not have a simple way to record their contributions and receive recognition.
Therefore, a location-aware and consent-based platform is needed to organize donor discovery, distribute requests in stages, support hospital coordination and encourage voluntary donation without replacing clinical screening or authorized blood-bank processes.
3. Proposed Solution
Yogdan proposes one shared platform delivered through three connected interfaces:
Platform
Primary purpose
Main users
1. Donor & Recipient Application
Account/profile management, donor discovery, blood requests, notifications, request responses, donation history and achievements.
Public users, potential donors, recipients and requesters
2. Hospital Web Dashboard
Hospital-side request creation and monitoring, controlled donor discovery, request coordination and relevant operational reporting.
Authorized hospital staff and administrators
3. Public Landing Website
Explain Yogdan, communicate its mission, provide help and route users to the app and hospital portal.
Public, prospective users, hospitals and partners


All three interfaces communicate with a common backend and shared data layer. Access is controlled by user role and permission. The system should expose only the information required for a particular task.
4. Project Objectives
Make it easier to discover potential blood donors within a defined distance of a recipient or hospital.
Use staged radius expansion to prioritize nearby donors and avoid unnecessary city-wide notifications.
Allow users to create requests for themselves or on behalf of another person.
Give donors control over their availability, notification preferences and profile information.
Provide hospitals with a secure dashboard to create and coordinate requests and find potential donors.
Maintain donation activity records and encourage voluntary participation through badges and a donor recognition board.
Build a simple, maintainable MVP that can later be expanded to more locations and partner institutions.
5. Scope and User Roles
5.1 Donor / General User
Every registered user may opt in to become a potential donor. The account is not treated as proof of medical eligibility. Users should be able to update their profile, declare whether they are currently willing to receive requests, manage notification preferences and review their activity.
Sign up, log in and verify a contact method such as mobile number or email.
Create and edit a profile with name, age/date-of-birth field as appropriate, blood group (including an unknown/not confirmed option), general location and preferred contact method.
Provide optional donor-related information such as last donation date and self-reported availability.
Choose whether to receive donor alerts and manage quiet hours or notification preferences.
Receive nearby blood-request alerts and respond: I can help, unavailable, or dismiss.
View request details necessary to decide whether to respond.
View donation history, submitted proof status, badges and recognition points.
5.2 Recipient / Requester
A requester may create a blood request for themselves or on behalf of another person. The requester should provide only the information needed to coordinate the request.
Create a request for self or select 'on behalf of someone else'.
Enter required blood group, component if known, units/quantity as requested by the treating facility, urgency and needed-by time.
Select the hospital or enter/pin the treatment location.
Provide a safe contact route and any instructions supplied by the hospital.
Track request status, donor responses and closure.
Cancel or mark a request fulfilled when the requirement is resolved.
5.3 Hospital User
Hospital users access a separate web dashboard. Each hospital should have an approved organization account, with named staff accounts and role-based permissions.
View and manage requests associated with the hospital.
Create a blood request on behalf of a patient, where authorized.
Search potential donors by blood group, distance and declared availability.
Review donor responses and coordinate contact through approved channels.
See request progress and a limited operational overview.
Record a donation as verified only after an authorized staff member checks the relevant evidence or confirms it through the hospital's process.
5.4 Platform Administrator
Approve and manage hospital organizations and staff access.
Review reports of abuse, duplicate requests or suspicious activity.
Configure radius stages, notification limits and system-wide settings.
Manage support requests, content and platform health.
Audit sensitive access and administrative actions.
6. Core Functional Modules
Module
Description
MVP priority
Authentication & roles
Secure registration, login, account recovery and role/permission checks.
Must have
User profile
Contact details, blood group, approximate location, donor opt-in and profile settings.
Must have
Blood request management
Create, edit, cancel, close and track requests; self or on-behalf-of flow.
Must have
Location & radius matching
Find opted-in potential donors around the selected request location.
Must have
Notification orchestration
Staged alert delivery, donor cooldown, deduplication and delivery tracking.
Must have
Donor response management
Record interest/unavailability and expose status to the requester/hospital.
Must have
Hospital dashboard
Hospital login, request list, donor search and response monitoring.
Must have
Donation history & badges
Donation submission, evidence status, achievement badges and profile history.
Should have
Community / Hall of Fame
Recognition board based on verified contributions, with privacy controls.
Should have
Analytics & sponsor placements
Aggregated metrics and carefully controlled sponsorship placements.
Later


7. Donor Matching and Notification Algorithm
The central matching principle is proximity-first, staged distribution. A request should not immediately notify every registered user in the city. Yogdan first searches for eligible-to-contact, opted-in potential donors within the smallest configured radius. If the response is insufficient after a defined waiting period, the search expands to the next radius.
7.1 Example: Request near AIIMS Bhubaneswar
Stage
Search radius from request location
Action
1
0–5 km
Find and notify matching, opted-in donors in this zone.
2
More than 5–10 km
If the request remains unfulfilled, expand to this next zone and notify newly eligible donors.
3
More than 10–15 km
Expand again if the required response/coverage has not been reached.
4
More than 15–20 km
Expand to the configured primary maximum radius.
5 – optional extended reach
20–30 km, then 30–50 km
Use only if enabled by the requester/hospital or configured as a low-priority fallback.


The exact stage intervals and the condition for expansion must be configurable and tested during the pilot. A radius is measured from the selected request/hospital location, not necessarily the requester's live location. This helps keep the search relevant to where the patient is receiving care.
7.2 Matching filters
A potential donor may be considered for an alert when the following checks pass:
The account is active and the user has opted in to receive donor requests.
The user has a usable location or a saved service-area location.
The declared blood group matches the request's configured search criteria. The platform must not independently certify clinical compatibility.
The donor has not disabled notifications, blocked the requester or been excluded for a safety/administrative reason.
The donor has not exceeded the configured notification cooldown or other rate limits.
Any self-reported availability information is current enough for the platform's rules.
Important: blood group matching in the app is only a discovery filter. Final donor eligibility, blood grouping confirmation, cross-matching, infection screening and transfusion decisions must be performed by qualified professionals through authorized blood-bank/hospital procedures.
7.3 Radius expansion logic
create request
    |
    v
validate request and geocode/pin hospital location
    |
    v
search opted-in potential donors in 0–5 km
    |
    v
notify eligible, not-yet-alerted donors
    |
    v
wait for configured response window
    |
    +---- enough suitable responses / request closed? ---- YES ---> stop alerts
    |
    NO
    v
expand to next ring: 5–10 km
    |
    v
repeat search, filtering and notification
    |
    v
continue through 10–15 km and 15–20 km
    |
    v
optional extended reach: 20–30 km / 30–50 km
    |
    v
notify requester/hospital of progress and final status
Implementation note: use distance rings (for example, 0–5 km, greater than 5–10 km) so a donor already notified in an inner ring is not notified again at every later stage. Store the request ID, donor ID, stage, notification status and timestamp to prevent duplicate alerts.
7.4 Donor notification cooldown and fatigue control
A donor near a busy hospital may be close to many separate requests. To reduce alert fatigue, Yogdan should apply a per-donor cooldown. The proposed starting policy is to avoid sending another routine donor-request notification to the same donor for approximately 6–7 hours after a previous alert. This is a product setting to validate in testing, not a medical rule.
Track the last donor-request notification timestamp for each user.
Apply the cooldown across requests, not just within one request.
Allow users to set quiet hours and pause donor alerts.
Do not send repeated notifications for the same request unless a meaningful status change justifies it.
Provide a notification preference screen and a clear opt-out mechanism.
If the cooldown prevents sufficient reach, show the requester/hospital that notification coverage is limited; do not silently bypass donor preferences.
The system should distinguish routine reminders from genuinely critical operational messages. Any exception to the cooldown must be explicitly designed, transparent to donors and approved during product/safety review; the MVP should default to respecting the cooldown.
7.5 Request lifecycle and stop conditions
Status
Meaning
Draft
Request has not yet been submitted.
Active – searching
Request is valid and donor discovery/notifications are in progress.
Responses received
One or more potential donors have expressed interest.
Coordination in progress
Requester or hospital is coordinating with one or more respondents.
Fulfilled / closed
Requester or authorized hospital user has confirmed that the requirement is resolved.
Cancelled
Requester or authorized staff has cancelled the request.
Expired
The needed-by time passed without the request being closed; manual review may still be needed.


The system should stop further notifications when the request is fulfilled, cancelled or expired. It should also stop or pause a stage when the required number of responses has been reached, based on a configurable threshold.
8. Application Workflow – Donor and Recipient
USER OPENS YOGDAN APP
        |
        v
SIGN UP / LOG IN
        |
        v
VERIFY CONTACT + COMPLETE PROFILE
        |
        +-------------------------------+
        |                               |
        v                               v
DONOR PROFILE / OPT-IN             NEED BLOOD?
        |                               |
        v                               v
SET BLOOD GROUP, LOCATION,         CREATE BLOOD REQUEST
AVAILABILITY & ALERT SETTINGS           |
        |                               v
        |                         SELF OR ON BEHALF OF
        |                               |
        |                               v
        |                         ENTER BLOOD REQUIREMENT,
        |                         HOSPITAL / LOCATION,
        |                         URGENCY & CONTACT
        |                               |
        |                               v
        |                         SUBMIT REQUEST
        |                               |
        |                               v
        |                         BACKEND VALIDATES REQUEST
        |                               |
        |                               v
        |                         LOCATION-BASED MATCHING
        |                               |
        |                               v
        |                         5 KM -> 10 KM -> 15 KM
        |                         -> 20 KM -> OPTIONAL 50 KM
        |                               |
        v                               v
RECEIVE NEARBY REQUEST ALERT <--- NOTIFICATION SERVICE
        |
        v
VIEW REQUEST DETAILS
        |
        +---------------------------+
        |                           |
        v                           v
I CAN HELP                    UNAVAILABLE / DISMISS
        |                           |
        v                           v
RESPONSE RECORDED              RESPONSE RECORDED
        |
        v
REQUESTER / HOSPITAL COORDINATES
        |
        v
DONATION TAKES PLACE THROUGH
AUTHORIZED HOSPITAL / BLOOD BANK
        |
        v
DONOR SUBMITS DONATION RECORD / PROOF
        |
        v
PENDING REVIEW -> VERIFIED (IF CONFIRMED)
        |
        v
BADGE / DONATION HISTORY / HALL OF FAME
A user can be both a donor and a requester using one account. Request creation should be an action available from the same profile; users should not need separate accounts for donor and recipient roles.
9. Hospital Dashboard Workflow
HOSPITAL STAFF OPENS HOSPITAL PORTAL
        |
        v
SECURE LOGIN + ORGANIZATION / STAFF ROLE CHECK
        |
        v
HOSPITAL DASHBOARD
        |
        +------------------------------+
        |                              |
        v                              v
CREATE REQUEST                 SEARCH DONOR DIRECTORY
        |                              |
        v                              v
PATIENT / REQUEST DETAILS       FILTER BY DECLARED BLOOD GROUP,
        |                       DISTANCE & AVAILABILITY
        v                              |
SUBMIT REQUEST                         v
        |                       VIEW PERMITTED DONOR DETAILS
        v                              |
SHARED BACKEND                         v
        |                       CONTACT / COORDINATE
        v                              |
RADIUS MATCHING + NOTIFICATIONS        |
        |                              |
        +---------------+--------------+
                        |
                        v
                REQUEST MONITORING
                        |
                        v
          REVIEW DONOR RESPONSES / STATUS
                        |
                        v
       CONFIRM FULFILLED, CANCEL OR CLOSE REQUEST
                        |
                        v
       VERIFY DONATION EVIDENCE IF APPLICABLE
Hospital access must be restricted to authorized staff and the relevant hospital organization. A hospital should not automatically receive unrestricted access to every user's complete health profile. Search results should reveal only the minimum information required for coordination, subject to user consent and applicable rules.
10. Interconnected Ecosystem Architecture
The three interfaces are separate frontends connected to a common API and shared services. This reduces duplicated business logic and ensures that a request created in the app can also be viewed and coordinated in the hospital dashboard.
                 PUBLIC USERS / HOSPITALS
                           |
           +---------------+----------------+
           |               |                |
           v               v                v
    YOGDAN APP       HOSPITAL DASHBOARD   LANDING WEBSITE
 Donor + Recipient   Authorized Staff    Public Information
 React Native /      Next.js              Next.js
 Next.js / React
           |               |                |
           +---------------+----------------+
                           |
                           v
                  SHARED BACKEND API
                       Node.js
                 (Express / NestJS)
                           |
        +------------------+-------------------+
        |                  |                   |
        v                  v                   v
 AUTH & ROLE SERVICE  REQUEST SERVICE    DONOR MATCHING SERVICE
        |                  |                   |
        +------------------+-------------------+
                           |
        +------------------+-------------------+
        |                  |                   |
        v                  v                   v
 NOTIFICATION SERVICE  DONATION / BADGE    HOSPITAL MANAGEMENT
 Push / Email / SMS    SERVICE             SERVICE
        |                  |                   |
        +------------------+-------------------+
                           |
                           v
                 DATABASE / DATA LAYER
             Supabase PostgreSQL OR MongoDB
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
     USER DATA        REQUEST DATA     HOSPITAL / AUDIT
     DONOR DATA       RESPONSE DATA    NOTIFICATION DATA
Supporting infrastructure may include a geospatial query/index, push notification provider, file/object storage for donation evidence, logging/monitoring and scheduled background jobs. These are supporting services rather than separate user-facing platforms.
11. Suggested Technology Stack
Layer
Proposed technology
Purpose / notes
Mobile application
React Native with Expo
Recommended for a dedicated Android/iOS donor and recipient app. One codebase can support both platforms.
Alternative app delivery
Next.js PWA or responsive React/Next.js web app
Useful if the team wants a browser-first MVP. Push notification support and device capabilities vary by browser/platform.
Hospital dashboard
Next.js + TypeScript
Responsive web dashboard with protected routes and role-based access.
Landing website
Next.js + TypeScript
Public-facing project website, app links, hospital portal link and support/information pages.
Backend API
Node.js with Express.js or NestJS
Central API for authentication integration, requests, matching, notifications, hospital workflows and badges.
Database option A
Supabase PostgreSQL
Relational data, SQL, constraints, row-level security, managed authentication and optional realtime capabilities.
Database option B
MongoDB Atlas
Document-oriented data model and flexible schemas. Geospatial indexes can support location queries.
Location / maps
Google Maps Platform or OpenStreetMap-based provider
Map display, place selection and geocoding. Choose based on pricing, coverage and terms.
Push notifications
Firebase Cloud Messaging (FCM)
Push notification delivery for supported Android/web clients; iOS configuration also required for React Native.
File storage
Supabase Storage or S3-compatible object storage
Store donation evidence securely with private access and short-lived signed URLs.
Deployment
Vercel for Next.js; suitable Node hosting for API
Separate deployment pipelines, environment variables and staging/production environments.


11.1 React Native vs Next.js for the main app
Recommended direction: use React Native with Expo if the capstone requires a true mobile-first app with dependable push notifications and device-level experience. Use Next.js as a responsive web companion only if time and team capacity allow. If the team has limited development time, a Next.js responsive web app/PWA is a reasonable first MVP, but the team should test notification behavior on its actual target devices before committing.
11.2 Supabase vs MongoDB
Consideration
Supabase / PostgreSQL
MongoDB Atlas
Data relationships
Strong fit for users, hospitals, requests, responses, roles and audit records with clear relationships.
Flexible documents; relationships can be modelled but need careful design.
Geospatial search
PostgreSQL can support geospatial queries with PostGIS where enabled/configured.
GeoJSON and 2dsphere indexes support proximity searches.
Consistency
Relational constraints and transactions are useful for request lifecycle and deduplication.
Transactions are available, but schema and consistency patterns need deliberate design.
Built-in services
Managed Postgres, Auth, Storage and Realtime options can reduce setup work.
Managed database; authentication, storage and realtime services usually need separate choices.
Best fit for Yogdan
Strong default recommendation for a relational, multi-role platform.
Good option if the team is more comfortable with document modelling or has a strong MongoDB reason.


Recommendation: choose Supabase PostgreSQL as the initial default because Yogdan has related entities and permission-sensitive workflows. Use PostGIS or a suitable geospatial strategy for radius queries. The Node.js backend can remain the central business-logic layer. If the team chooses MongoDB, use GeoJSON points and 2dsphere indexes for proximity search.
Do not attempt to use both databases for the same core records in the MVP. Pick one source of truth to avoid synchronization complexity. Supabase can provide database/auth/storage services while Node.js remains responsible for application-specific workflows; avoid duplicating authentication logic unnecessarily.
12. Initial Data Model
The following is a conceptual starting model. Exact fields, validation rules and retention periods must be finalized during R&D.
Entity / collection
Key fields (illustrative)
Purpose
Users
id, name, phone/email, role flags, account status, created_at
Identity and account-level preferences.
DonorProfiles
user_id, blood_group, location, donor_opt_in, availability, last_donation_date (self-reported)
Potential donor information and preferences.
RecipientProfiles
user_id, optional profile details, preferred contact
Optional recipient-specific information; do not duplicate unnecessary data.
Hospitals
id, name, address, coordinates, verification_status
Hospital organization and location.
HospitalStaff
user_id, hospital_id, staff_role, access_status
Links staff to a hospital and defines permissions.
BloodRequests
id, requester_id, patient_reference, hospital_id, blood_group, component, units, urgency, needed_by, coordinates, status
Request details and lifecycle.
RequestResponses
id, request_id, donor_id, response_status, responded_at
Tracks donor interest and availability.
NotificationLogs
id, request_id, donor_id, radius_stage, sent_at, delivery_status
Prevents duplicate alerts and supports cooldown/audit.
DonationRecords
id, donor_id, hospital_id, donation_date, evidence_file_id, verification_status, reviewed_by
Donation history and evidence review.
Badges / Achievements
id, donor_id, badge_type, awarded_at, verification_level
Recognition and donor milestones.
AuditLogs
id, actor_id, action, resource_type, resource_id, timestamp
Sensitive access and administrative accountability.


Health and identity fields should be minimized. Store precise location only where necessary, protect it strongly and avoid showing a donor's exact home location to other users. Use approximate location or distance for discovery, and reveal contact details only through a consent-based flow.
13. Additional Features – Useful and Achievable
13.1 Recommended for the MVP
Request status tracking: searching, responses received, coordination in progress, fulfilled, cancelled and expired.
Donor availability toggle: let users pause alerts or mark themselves unavailable.
Request expiry and auto-stop: stop new alerts after closure or the needed-by time.
In-app notification centre: show past alerts and request updates even if a push notification is missed.
Duplicate request detection: warn when the same requester creates repeated requests for the same patient, hospital and time window.
Hospital verification: require a basic approval process before a hospital organization can access the dashboard.
Donation history: allow donors to record past donations and view submitted/verified status.
Help and safety information: explain that app matching is not medical clearance and direct users to authorized blood banks/hospitals.
13.2 Donor motivation – badges and Hall of Fame
Yogdan can recognize voluntary donors through a positive achievement system. A donor may upload a donation-related document or photograph after donating. The submission should initially be marked 'Pending verification'. Once an authorized hospital/blood-bank representative or an approved verification workflow confirms the donation, Yogdan can award a verified badge.
Achievement
Example award condition
Display label
First Step
First donation record submitted and verified
First Donation
Life Supporter
A verified donation milestone
Verified Donor
Consistent Contributor
Multiple verified donations over time, subject to applicable donation intervals
Consistent Contributor
Community Champion
Meaningful verified contribution or approved community support milestone
Community Champion


The Hall of Fame should rank by verified contributions or milestone tiers, not by unverified uploads or the number of emergency alerts answered. Avoid rewarding frequent donation in a way that encourages medically unsafe behavior. Recognition must never pressure someone to donate before they are medically eligible.
Evidence uploads should be private by default. The donor can choose whether to share a redacted image in the community feed. The platform should warn users not to upload documents containing unnecessary medical identifiers or sensitive information.
13.3 Later enhancements
Hospital/blood-bank inventory integration, only where a partner provides a supported and authorized data feed.
Multilingual interface and accessibility improvements.
Volunteer/community awareness events and educational content.
Aggregated, non-identifying analytics for hospitals and project administrators.
Sponsor placements from approved partners, clearly labelled and kept separate from medical guidance.
Additional service areas and configurable regional operations.
14. Security, Privacy and Medical Safety
Yogdan handles personal information and may handle sensitive health-related information. Privacy and safety must be part of the initial architecture, not an afterthought.
Collect only the information needed to operate donor discovery and request coordination.
Use role-based access control for public users, hospital staff and platform administrators.
Require hospital verification and individual staff accounts; do not use a shared hospital password.
Protect data in transit with HTTPS and at rest using the hosting provider's encryption capabilities.
Use private file storage, signed URLs, file-type/size checks and access logs for uploaded evidence.
Do not expose exact donor home coordinates or unrestricted health profiles to requesters or hospitals.
Obtain clear consent before sending donor notifications or sharing contact information.
Provide account controls to pause alerts, update data and request account deletion where applicable.
Keep audit records for sensitive access and administrative changes.
Use rate limits, abuse reporting, spam prevention and request verification to reduce fraudulent requests.
Create a clear privacy notice, terms of use and data retention policy before public deployment.
Clinical boundary: Yogdan is a donor discovery and coordination tool, not a diagnostic, eligibility or blood-compatibility decision system. The treating hospital or authorized blood bank must confirm blood group, donor eligibility, screening, cross-match and transfusion suitability. The app must not imply that a nearby match is medically approved.
15. Non-Functional Requirements
Requirement
Expected behavior
Usability
Simple, mobile-first screens with a short request-creation flow and clear status labels.
Performance
Nearby donor searches and dashboard lists should return promptly under expected pilot load.
Reliability
Notification jobs should be retried safely and should not create duplicate alerts.
Scalability
Radius matching and notification processing should support additional service areas over time.
Security
Authenticated access, least-privilege permissions, secure storage and audit logging.
Availability
Graceful handling of notification-provider or map-service outages; show current request status.
Accessibility
Readable typography, adequate contrast, screen-reader labels and simple language.
Maintainability
Shared API contracts, documented data models, environment separation and tests.


16. Suggested API Groups
The exact routes will be designed during implementation. These example API groups help divide backend tasks.
API group
Example operations
Authentication
Register, login, logout, verify contact, refresh session
Users / profiles
Get/update profile, donor opt-in, availability and notification preferences
Blood requests
Create, get details, list, update, cancel, close
Matching
Preview eligible donor count, run matching stage, retrieve matching status
Responses
Respond to request, withdraw response, view request responses (permission checked)
Hospitals
Hospital registration, verification, staff management, hospital request list
Notifications
Notification history, device token registration, preferences
Donations
Submit donation record, upload evidence, review/verify status
Badges
List achievements, award verified badge, leaderboard
Administration
Moderation, audit log, system configuration


17. Development Phases and Team Deliverables
Phase
Work
Deliverable
1. R&D and requirement freeze
Confirm user roles, request fields, radius stages, notification cooldown, privacy rules and hospital workflow.
Approved requirements and wireframes.
2. Architecture and database
Select database, define entities, API contracts, auth and permissions.
Architecture diagram, ER model and API specification.
3. Core app
Authentication, profile, donor opt-in, request creation and request status.
Working donor/recipient app or responsive web app.
4. Matching and notifications
Geospatial search, staged radius expansion, cooldown, deduplication and notification history.
Tested matching and notification engine.
5. Hospital dashboard
Hospital verification, staff login, donor search, request monitoring and status updates.
Working hospital dashboard.
6. Landing website
Project overview, how it works, FAQs, safety information and app/dashboard links.
Public landing website.
7. Donation recognition
Evidence submission, review status, verified badges and Hall of Fame.
Donation record and achievement module.
8. Testing and pilot
Functional, security, usability and notification tests; pilot with a limited group and partner facility.
Test report, demo-ready build and improvement backlog.


For a capstone deadline, prioritize phases 1–6. Donation verification and Hall of Fame can be implemented as a simple, controlled module if time permits. Avoid adding payment, advertising, inventory integrations or complex AI features before the core workflow is reliable.
18. Testing Plan and Success Measures
18.1 Key test scenarios
A request at a test location notifies only matching opted-in donors in the first radius ring.
Donors in the next ring are notified only when the request advances to that stage.
A donor already notified for a request is not notified again at a later radius stage.
A donor who received a recent alert is suppressed by the cooldown for routine requests.
Closing or cancelling a request stops future notification jobs.
A user can create a request for themselves and on behalf of another person.
A hospital staff member can access only the hospital and request data permitted by their role.
A donation upload remains pending until reviewed and cannot award a verified badge automatically.
A user can pause notifications and no new routine donor alerts are sent while paused.
Unauthorized users cannot retrieve private donor details or evidence files.
18.2 Pilot metrics
Time from request submission to first donor response.
Number of potential donors found per radius stage.
Notification delivery and response rate by stage.
Percentage of requests closed as fulfilled, cancelled or expired.
Duplicate alert rate and cooldown suppression count.
Donor opt-in, pause and opt-out rates.
Hospital staff task completion time and usability feedback.
These metrics should be used to evaluate the system, not to claim that Yogdan guarantees blood availability or a successful transfusion.
19. Key Decisions to Finalize During R&D
Decision
Recommended starting point
Needs validation
Main app delivery
React Native + Expo for mobile-first; Next.js PWA if schedule is tight.
Team skills, target devices and push notification testing.
Database
Supabase PostgreSQL with geospatial support.
Data model, hosting limits, geospatial setup and cost.
Backend
Node.js + Express.js for a familiar lightweight API; NestJS if stronger structure is needed.
Team familiarity and project complexity.
Radius stages
5, 10, 15 and 20 km; optional 30–50 km extended reach.
Pilot response data and local geography.
Notification cooldown
Initial 6–7 hour routine-alert cooldown per donor.
Donor feedback and request volume.
Expansion trigger
After a configurable wait or when response count is below a target.
Urgency categories and pilot behavior.
Donor verification
Self-reported profile; medical eligibility confirmed by authorized professionals.
Hospital/blood-bank partner process.
Donation badge
Pending evidence review, then verified badge.
Who can verify and acceptable evidence.
Hospital access
Approved organization + individual staff roles.
Verification process and data-sharing agreement.


20. Conclusion
Yogdan aims to make blood donor discovery more organized, location-aware and responsive by connecting potential donors, recipients and hospitals through one shared digital ecosystem. Its most important differentiator is the staged proximity-based notification model: nearby donors are prioritized first, and the search expands only when needed. A donor-level notification cooldown helps reduce alert fatigue, while the hospital dashboard gives authorized medical staff a structured way to create requests and coordinate responses.
The project should begin with a focused MVP: user profiles and donor opt-in, request creation, radius-based donor discovery, controlled notifications, donor responses, hospital request management and a public landing page. Donation history, verified badges and the Hall of Fame can add a positive community layer once the core system is dependable.
Yogdan's success should be measured by whether it helps people coordinate more effectively and responsibly—not by the number of features it contains. The platform supports discovery and coordination; all medical decisions and transfusion procedures remain with qualified healthcare professionals and authorized facilities.
Appendix A – Short Project Description for PPT / Synopsis
Yogdan is a location-aware blood donation and donor-connectivity platform that connects people in need of blood with potential voluntary donors in nearby areas. Through a donor and recipient application, a hospital management dashboard and a public landing website, Yogdan creates one interconnected ecosystem for blood request creation, donor discovery and request coordination. Its staged radius-based matching system prioritizes nearby donors—starting with a 5 km radius and expanding progressively when required—while notification cooldowns help prevent donor fatigue. The platform also supports donation history, evidence review and achievement badges to encourage voluntary participation. Yogdan is a coordination platform and does not replace clinical screening, compatibility testing or authorized blood-bank procedures.
Appendix B – Glossary
Term
Meaning
Donor opt-in
A user's explicit choice to be discoverable and receive donor requests.
Radius stage
A defined distance ring used to progressively expand donor discovery.
Cooldown
A minimum interval between routine donor-request notifications to the same user.
Request lifecycle
The statuses a blood request passes through from creation to closure.
Potential donor
A person who has opted in and appears in the platform's discovery filters; not a medically cleared donor.
Verified donation
A donation record confirmed through an approved hospital/blood-bank review process.
RBAC
Role-based access control: permissions based on the user's role and organization.


