import { Module } from './types'

export const phase2Modules: Module[] = [
  // ========================================
  // MÓDULO 1: Understanding Hail & Damage
  // ========================================
  {
    id: 'phase2-module1',
    phase: 2,
    title: 'Understanding Hail Season & Damage',
    description: 'Learn about hail season timing and how hail affects roofing systems',
    duration: '20 min',
    content: [
      {
        type: 'text-image',
        title: 'Understanding Hail Season',
        text: `**When is Hail Season?**

Typically runs from mid-March through June. Sporadic storms can occur throughout the year, even in December. Prime months: March – June`,
        image: '/training/modules/phase2/hail-season.jpg',
        imageAlt: 'Hail season timeline in Texas',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'How is Hail Created?',
        text: `Hail forms in severe thunderstorms when updrafts carry raindrops into extremely cold areas of the atmosphere, where water freezes into ice. These frozen droplets cycle through the storm, accumulating layers until they become too heavy and fall as hail.`,
        image: '/training/modules/phase2/hail-formation.jpg',
        imageAlt: 'How hail is formed in storms',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'How Hail Damage Affects Roofing',
        text: `**Granule Loss**

Hail breaks loose and removes granules, exposing the asphalt base mat and shortening shingle life`,
        image: '/training/modules/phase2/granule-loss.jpg',
        imageAlt: 'Granule loss from hail damage',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Uniformity',
        text: `**Uniformity**

Granules provide uniform pattern and color matching to the property`,
        image: '/training/modules/phase2/uniformity.jpg',
        imageAlt: 'Roof uniformity and granules',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'UV Protection',
        text: `**UV Protection**

Granules shield UV light from the base of the shingle`,
        image: '/training/modules/phase2/uv-protection.jpg',
        imageAlt: 'UV protection from granules',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Structural Damage',
        text: `**Structural Damage**

Impact can cause bruising, fracturing, and cracking`,
        image: '/training/modules/phase2/structural-damage.jpg',
        imageAlt: 'Structural damage from hail',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Water Intrusion',
        text: `**Water Intrusion**

Compromised shingles lead to leaks and interior damage`,
        image: '/training/modules/phase2/water-intrusion.jpg',
        imageAlt: 'Water intrusion from damaged roof',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      }
    ]
  },

  // ========================================
  // MÓDULO 2: Roofing Knowledge & Terminology
  // ========================================
  {
    id: 'phase2-module2',
    phase: 2,
    title: 'Roofing Knowledge & Terminology',
    description: 'Essential terms, roof types, components, and materials',
    duration: '35 min',
    content: [
      {
        type: 'text',
        title: 'Essential Roofing Terms',
        text: `**ACV - Actual Cash Value**
Current value based on depreciation

**RCV - Replacement Cost Value**
Cost of brand new replacement

**D&R - Detach and Reset**
Removing and reinstalling components

**R&R - Remove and Replace**
Replacing damaged components

**O&P - Overhead & Profit**
Administrative costs and profit margin

**PWI - Paid When Incurred**
Expenses paid as they occur

**Facets**
Different sections or aspects of a roof`
      },
      
      {
        type: 'text',
        title: 'More Essential Terms',
        text: `**Ridge**
The highest point on a roof where two areas meet

**Valley**
V-shaped angle where two slopes meet

**IBC - International Building Code**
For commercial buildings

**IRC - International Residential Code**
For residential buildings

**Xactimate**
Software used by insurance companies to calculate fair market value`
      },
      
      {
        type: 'text-image',
        title: 'Common Roof Types',
        image: '/training/modules/phase2/rooftypes.jpg',
        imageAlt: 'Common roof types diagram',
        imagePosition: 'right',
        imageSize: 'large',
        items: [
          'Gable Roof',
          'Hip Roof',
          'Mansard Roof',
          'Gambrel Roof',
          'Flat Roof',
          'Shed Roof',
          'Butterfly Roof',
          'A-Frame Roof',
          'Bonnet Roof',
          'Jerkinhead Roof',
          'Dutch Gable',
          'Clerestory Roof'
        ]
      },
      
      {
        type: 'text-image',
        title: 'Roof Accessories & Components',
        image: '/training/modules/phase2/roof-accessories.jpg',
        imageAlt: 'Roof accessories and components',
        imagePosition: 'right',
        imageSize: 'large',
        items: [
          'Step Flashing',
          'Pipe Flashing (various types)',
          'Ridge Vents',
          'Skylights',
          'Solar Tube Skylights',
          'Chimney Flashing',
          'Drip Edge',
          'Turtle Vents (550 & 750)',
          'Wind Turbines',
          'Valley Flashing',
          'Counter Flashing',
          'High Profile Ridge',
          '3-Tab Ridge'
        ]
      },
      
      {
        type: 'text',
        title: 'Roofing Materials Overview',
        text: `**Common Materials by Package Size:**

**Ice and Water Shield**
1 roll = 65 linear feet

**Synthetic Underlayment**
1 roll = 10 squares

**Starter Shingles**
1 bundle = 100 linear feet

**Field Shingles**
3 bundles = 1 square

**3-Tab Ridge Caps**
1 bundle = 30 linear feet

**Hip & Ridge**
1 bundle = 30 linear feet

**High Profile Ridge**
1 box = 20 linear feet

**Drip Edge**
10 feet per piece`
      }
    ]
  },

  // ========================================
  // MÓDULO 3: Sales Process & Customer Approach
  // ========================================
  {
    id: 'phase2-module3',
    phase: 2,
    title: 'Sales Process & Customer Approach',
    description: 'Your role and how to approach potential customers professionally',
    duration: '25 min',
    content: [
      {
        type: 'text-image',
        title: 'Your Role',
        text: `**Act as a representative for XRoofing & Solar and provide customers with:**

- Information about services
- Explanations of the process
- Answers about materials
- Accurate estimates

**Finding Customers**

**Look for properties that have:**

- Recent hail damage
- Signs of wear and tear
- Visible roof damage
- Aging roofing systems`,
        image: '/training/modules/phase2/your-role.jpg',
        imageAlt: 'Professional roofing representative',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Approaching Potential Customers',
        text: `**When approaching potential customers, remember to:**

- Introduce yourself professionally
- Explain the reason for your visit
- Provide company information
- Be courteous and respectful
- Listen to their concerns
- Build rapport and trust

Approaching customers requires tact and skill. You may approach in person, by phone, or via email. The key is building trust from the first interaction.`,
        image: '/training/modules/phase2/approaching-customers.jpg',
        imageAlt: 'Professional customer approach',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      }
    ]
  },

  // ========================================
  // MÓDULO 4: AccuLynx Training
  // ========================================
  {
    id: 'phase2-module4-acculynx',
    phase: 2,
    title: 'AccuLynx Training — Roofing Workflow',
    description: 'Master AccuLynx through all 4 stages: Lead → Prospect → Approved → Completed',
    duration: '45 min',
    content: [
      {
        type: 'text-image',
        title: 'AccuLynx Training Overview',
        text: `**Welcome to AccuLynx Training**

AccuLynx is our project management software that helps you track every customer from the initial lead all the way to project completion.

**You will learn how to:**
- Create and manage leads
- Update prospects with insurance information
- Move projects to approved status
- Complete and close out finished jobs

This training includes video demonstrations for each stage and a knowledge assessment to ensure you understand the workflow. Let's get started!`,
        image: '/training/modules/phase2/acculynx-overview.jpg',
        imageAlt: 'AccuLynx software overview',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },

      // VIDEO 1: LEAD STAGE
      {
        type: 'video',
        title: 'VIDEO 1: Creating a New Lead in AccuLynx',
        videoUrl: '/training/modules/acculynx/LEAD.webm',
        videoTitle: 'Creating a New Lead in AccuLynx',
        text: `**LEAD STAGE - Creating New Leads**

**Steps to Create a Lead:**

**1. Click '+ Add Lead' to create a new customer record**

**2. Fill out all customer details:**
   • Full Name
   • Address
   • Phone Number
   • Email
   • Type of roof or service requested

**3. Add photos taken during initial visit or inspection**

**4. Use Comments to tag team members:**
   • @Adam Ortez – general project communication
   • @Oscar Gomez – insurance paperwork, scheduling, or final invoices
   • @Jose De La Torre – non-roofing work requests
   • @Estimating Team – supplements or estimate questions

💡 Pro Tip: Always double-check spelling and contact information before saving!`
      },

      // VIDEO 2: PROSPECT STAGE
      {
        type: 'video',
        title: 'VIDEO 2: Updating to Prospect Stage',
        videoUrl: '/training/modules/acculynx/PROSPECT.webm',
        videoTitle: 'Updating to Prospect and Adding Insurance Information',
        text: `**PROSPECT STAGE - After Insurance Contact**

**Steps to Update to Prospect:**

**1. Change status to 'Prospect' after inspection is completed and insurance company has been contacted**

**2. Go to Insurance Information section and fill out:**
   • Insurance Company Name
   • Claim Number
   • Adjuster Name
   • Adjuster Phone and Email

**3. Upload inspection photos or reports if available**

**4. Use Comments to communicate updates:**
   • Tag @Oscar Gomez for insurance paperwork or invoices
   • Tag @Adam Ortez to keep him informed
   • Tag @Estimating Team for supplements or estimate questions

This stage confirms that you've made contact with the insurance company and have all necessary claim information documented.`
      },

      // VIDEO 3: APPROVED STAGE
      {
        type: 'video',
        title: 'VIDEO 3: Moving to Approved Stage',
        videoUrl: '/training/modules/acculynx/APPROVED.webm',
        videoTitle: 'Moving to Approved and Uploading Key Documents',
        text: `**APPROVED STAGE - Contract Signed**

**Steps to Move to Approved:**

**1. Change project status to 'Approved' once customer signs contract**

**2. Go to Documents section and upload:**
   • Signed Contract
   • Insurance Estimate
   • Company Estimate (Sales Worksheet)
   • Roof Measurements

**3. Add any additional project notes or adjustments**

**4. In Comments, tag @Adam Ortez and @Oscar Gomez to confirm:**
   • Job has been approved
   • All documents are uploaded

💡 Pro Tip: Ensure all documents are correctly labeled and easy to identify:
   • Example: "Smith_Contract.pdf"
   • Example: "Insurance_Estimate.pdf"

Proper document organization prevents confusion and speeds up the approval process!`
      },

      // VIDEO 4: COMPLETED STAGE
      {
        type: 'video',
        title: 'VIDEO 4: Closing Out Completed Projects',
        videoUrl: '/training/modules/acculynx/COMPLETED.webm',
        videoTitle: 'Completing the Job and Notifying the Team',
        text: `**COMPLETED STAGE - Final Closeout**

**Steps to Complete a Job:**

**1. Update job status to 'Completed' when roof installation is finished**

**2. Upload photos of finished roof installation:**
   • Clear photos showing all sides
   • Professional quality representing company standards

**3. In Comments, tag:**
   • @Adam Ortez and @Oscar Gomez - notify job is done and ready for review/invoicing
   • @Estimating Team - if supplements or additional paperwork needed

💡 Pro Tip: Final photos should be professional and showcase the quality of our work. These photos may be used for:
   • Customer records
   • Marketing materials
   • Insurance documentation
   • Portfolio showcases

Take pride in your documentation - it represents XRoofing & Solar's commitment to excellence!`
      },

      // Workflow Summary Images
      {
        type: 'text-image',
        title: 'AccuLynx Workflow Summary',
        text: `**Stage 1: LEAD**

- Create customer record
- Add contact information
- Upload initial photos
- Tag appropriate team members`,
        image: '/training/modules/phase2/workflow-lead.jpg',
        imageAlt: 'Lead stage workflow',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Stage 2: PROSPECT',
        text: `**Stage 2: PROSPECT**

- Update after insurance contact
- Add insurance information
- Upload inspection reports
- Keep team informed via comments`,
        image: '/training/modules/phase2/workflow-prospect.jpg',
        imageAlt: 'Prospect stage workflow',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Stage 3: APPROVED',
        text: `**Stage 3: APPROVED**

- Change status after contract signing
- Upload all required documents
- Verify document accuracy
- Notify team of approval`,
        image: '/training/modules/phase2/workflow-approved.jpg',
        imageAlt: 'Approved stage workflow',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text-image',
        title: 'Stage 4: COMPLETED',
        text: `**Stage 4: COMPLETED**

- Update when installation finished
- Upload professional completion photos
- Tag team for final review
- Close out project properly

Remember: Proper use of AccuLynx ensures smooth project flow, clear communication, and professional record-keeping throughout every job!`,
        image: '/training/modules/phase2/workflow-completed.jpg',
        imageAlt: 'Completed stage workflow',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },

      // EXAMEN DE ACCULYNX
      {
        type: 'exam',
        title: 'AccuLynx Knowledge Assessment',
        description: 'Test your understanding of the AccuLynx workflow - passing score 80%',
        passingScore: 80,
        questions: [
          {
            id: 1,
            question: "What is the first step when creating a new lead in AccuLynx?",
            options: {
              A: "Upload photos first",
              B: "Click '+ Add Lead' to create a new customer record",
              C: "Contact the insurance company",
              D: "Tag team members in comments"
            },
            correctAnswer: 'B'
          },
          {
            id: 2,
            question: "Who should you tag for general project communication in AccuLynx comments?",
            options: {
              A: "@Jose De La Torre",
              B: "@Estimating Team",
              C: "@Oscar Gomez",
              D: "@Adam Ortez"
            },
            correctAnswer: 'D'
          },
          {
            id: 3,
            question: "Who should you tag for insurance paperwork, scheduling, or final invoices?",
            options: {
              A: "@Adam Ortez",
              B: "@Oscar Gomez",
              C: "@Jose De La Torre",
              D: "@Estimating Team"
            },
            correctAnswer: 'B'
          },
          {
            id: 4,
            question: "Who should you tag for non-roofing work requests?",
            options: {
              A: "@Oscar Gomez",
              B: "@Adam Ortez",
              C: "@Jose De La Torre",
              D: "@Estimating Team"
            },
            correctAnswer: 'C'
          },
          {
            id: 5,
            question: "Who should you tag for supplements or estimate-related questions?",
            options: {
              A: "@Jose De La Torre",
              B: "@Oscar Gomez",
              C: "@Adam Ortez",
              D: "@Estimating Team"
            },
            correctAnswer: 'D'
          },
          {
            id: 6,
            question: "When should you change a lead's status to 'Prospect'?",
            options: {
              A: "As soon as you create the lead",
              B: "After the inspection is completed and insurance company has been contacted",
              C: "When the contract is signed",
              D: "When the job is finished"
            },
            correctAnswer: 'B'
          },
          {
            id: 7,
            question: "What information must be added in the Prospect stage?",
            options: {
              A: "Signed contract and final photos",
              B: "Only the customer's phone number",
              C: "Insurance company name, claim number, adjuster name and contact info",
              D: "Roof measurements and company estimate"
            },
            correctAnswer: 'C'
          },
          {
            id: 8,
            question: "When should you move a project to 'Approved' status?",
            options: {
              A: "After creating the lead",
              B: "After contacting insurance",
              C: "Once the customer signs the contract",
              D: "When the roof is installed"
            },
            correctAnswer: 'C'
          },
          {
            id: 9,
            question: "Which documents must be uploaded in the Approved stage?",
            options: {
              A: "Only photos of the damaged roof",
              B: "Signed contract, insurance estimate, company estimate, roof measurements",
              C: "Just the signed contract",
              D: "Completion photos and final invoice"
            },
            correctAnswer: 'B'
          },
          {
            id: 10,
            question: "What is a best practice for naming uploaded documents?",
            options: {
              A: "Use random numbers like '12345.pdf'",
              B: "Name them all 'document.pdf'",
              C: "Use clear labels like 'Smith_Contract.pdf' or 'Insurance_Estimate.pdf'",
              D: "Don't name them, just upload"
            },
            correctAnswer: 'C'
          },
          {
            id: 11,
            question: "When should you update a job to 'Completed' status?",
            options: {
              A: "When the contract is signed",
              B: "When insurance approves the claim",
              C: "When the roof installation is finished",
              D: "As soon as you create the lead"
            },
            correctAnswer: 'C'
          },
          {
            id: 12,
            question: "What type of photos should be uploaded in the Completed stage?",
            options: {
              A: "Only one photo of the front of the house",
              B: "Clear, professional photos showing all sides of the finished roof",
              C: "Photos of the damaged roof before work began",
              D: "Photos are not required in the Completed stage"
            },
            correctAnswer: 'B'
          },
          {
            id: 13,
            question: "What should you always double-check before saving a new lead?",
            options: {
              A: "The weather forecast",
              B: "Spelling and contact information accuracy",
              C: "The customer's insurance claim number",
              D: "The completion date"
            },
            correctAnswer: 'B'
          },
          {
            id: 14,
            question: "Why is it important to tag team members in AccuLynx comments?",
            options: {
              A: "It's not important, it's optional",
              B: "To ensure clear communication and notify the right people about updates",
              C: "Only to annoy them with notifications",
              D: "Tags don't do anything in AccuLynx"
            },
            correctAnswer: 'B'
          },
          {
            id: 15,
            question: "What is the correct order of the AccuLynx workflow stages?",
            options: {
              A: "Completed → Lead → Prospect → Approved",
              B: "Prospect → Lead → Completed → Approved",
              C: "Lead → Prospect → Approved → Completed",
              D: "Approved → Lead → Prospect → Completed"
            },
            correctAnswer: 'C'
          },
          {
            id: 16,
            question: "In the Lead stage, what types of photos should you add?",
            options: {
              A: "Only photos of the customer",
              B: "Photos taken during the initial visit or inspection",
              C: "Photos of other houses in the neighborhood",
              D: "No photos are needed in the Lead stage"
            },
            correctAnswer: 'B'
          },
          {
            id: 17,
            question: "Why should completion photos be professional quality?",
            options: {
              A: "They don't need to be professional",
              B: "They represent company standards and may be used for marketing and records",
              C: "Only for fun",
              D: "Insurance doesn't care about photo quality"
            },
            correctAnswer: 'B'
          },
          {
            id: 18,
            question: "What information is required when filling out customer details in the Lead stage?",
            options: {
              A: "Only name and address",
              B: "Full name, address, phone, email, and type of service requested",
              C: "Just the phone number",
              D: "Only the address"
            },
            correctAnswer: 'B'
          },
          {
            id: 19,
            question: "If you need help with a supplement or estimate question, who should you tag?",
            options: {
              A: "@Oscar Gomez",
              B: "@Jose De La Torre",
              C: "@Estimating Team",
              D: "No one, handle it yourself"
            },
            correctAnswer: 'C'
          },
          {
            id: 20,
            question: "What is the main purpose of using AccuLynx in your roofing workflow?",
            options: {
              A: "To replace all communication with customers",
              B: "To track every customer from lead to completion with clear records and team communication",
              C: "Only to store photos",
              D: "It's not really necessary to use"
            },
            correctAnswer: 'B'
          }
        ]
      }
    ]
  },

  // ========================================
  // MÓDULO 5: Inspections & Documentation
  // ========================================
  {
    id: 'phase2-module5',
    phase: 2,
    title: 'Inspections & Documentation',
    description: 'Complete roof inspections and master Acculynx job stages',
    duration: '40 min',
    content: [
      {
        type: 'text-image',
        title: 'Completing the Roof Inspection',
        text: `**Download Acculynx for streamlined documentation**`,
        image: '/training/modules/phase2/acculynx-overview.jpg',
        imageAlt: 'Acculynx app interface',
        imagePosition: 'right',
        imageSize: 'medium',
        items: [
          'Home Identification: Take selfie and front elevation photo',
          'Highlight Urgency Factors: Missing shingles, algae, discoloration',
          'Check Soft Metal Damage',
          'Capture Hail Closeups: Up to 5 hail strike photos',
          'Test Squares: 10" x 10" (up to 2 test squares)',
          'Engage Homeowner: Text updates and invite to view damage',
          'Video Walkthrough: Professional greeting with customer name, date, findings'
        ]
      },
      
      {
        type: 'text-image',
        title: 'Post-Claim Inspection',
        text: `**After Claim Approval:**

- Capture pictures of all elevations from roof view
- Count and verify number of metal components
- Ensure accurate material ordering
- Inspect entire property including fences, AC units, gutters, deck, and siding`,
        image: '/training/modules/phase2/post-claim-inspection.jpg',
        imageAlt: 'Post-claim roof inspection',
        imagePosition: 'right',
        imageSize: 'medium',
        items: []
      },
      
      {
        type: 'text',
        title: 'Acculynx Job Stages',
        text: `**New Lead Not Inspected**
Initial lead entry

**Inspected Not Filed**
Damage found, claim not yet filed

**Claim Filed**
Insurance claim submitted

**Pending Estimate**
Awaiting insurance scope

**Pending Signing**
Upload preliminary scope amount

**Contingency Signed**
Ready for supplement

**In Supplement**
Supplement team working

**Supplement Approved**
Move forward with signing`
      },
      
      {
        type: 'text',
        title: 'Acculynx Job Stages (Continued)',
        text: `**In Appraisal**
If supplement didn't work

**Proposal Signed**
Contract signed, awaiting audit

**Scheduled**
Materials ordered, crew assigned

**Installed**
Roofing work completed

**Invoiced**
Final invoice sent to insurance

**Depreciation Released**
Final check coming

**Closeout Review**
PM verifies all invoices

**Job Completed**
All payments received`
      }
    ]
  },

  // ========================================
  // MÓDULO 6: Sales Strategy & Success
  // ========================================
  {
    id: 'phase2-module6',
    phase: 2,
    title: 'Sales Strategy & Success',
    description: 'Door knocking scripts, daily schedule, and the law of 100 rejections',
    duration: '30 min',
    content: [
      {
        type: 'text',
        title: 'Simple Door Knocking Script',
        text: `"Good day, I'm [Your Name], a Project Manager with XRoofing & Solar. We've been working with homeowners in your neighborhood affected by the recent hailstorm."

"Upon inspecting their property, I noticed similar damage on your gutters as we've seen on [Neighbor's Name]'s home, which we're currently assisting with their insurance claim."

"Could I take about 10-15 minutes to assess your roof's condition? I'll show you any damage I find and explain the process. May I ask who your insurance provider is?"

"Excellent! We have strong experience with them. Before we proceed, may I have your name and contact information?"`
      },
      
      {
        type: 'text-image',
        title: 'Building a $100K+ Annual Income',
        text: `**Daily Schedule Strategy - 40 hours per week**`,
        image: '/training/modules/phase2/calendar.jpg',
        imageAlt: 'Daily schedule calendar',
        imagePosition: 'right',
        imageSize: 'medium',
        items: [
          '8 AM - Noon: Adjuster meetings, roof inspections, customer follow-ups',
          '12:00 - 12:30 PM: Lunch break',
          '12:30 - 4:30 PM: Door knocking',
          '4:30 - 8:30 PM: PRIME TIME - In-house closing',
          '',
          'Minimum goal: 2 at-the-table closings per day × 5 days per week = 10 opportunities per week'
        ]
      },
      
      {
        type: 'text-image',
        title: 'Law of 100 Rejections',
        text: `**20 rejections per day × 5 days = 100 rejections per week**`,
        image: '/training/modules/phase2/law.jpg',
        imageAlt: 'Law of 100 rejections',
        imagePosition: 'right',
        imageSize: 'medium',
        items: [
          'Each NO leads you closer to a YES',
          'If 10 say YES from 100 rejections',
          'If 5 convert to signed contracts @ $35,000 each',
          'Estimated commission: $5,000 per deal = $25,000',
          '$25,000 ÷ 100 rejections = $250 per NO',
          '',
          'You can set inspections same day or schedule for next morning to focus on getting 3 inspections per day, then return for table closings after 5 PM.'
        ]
      }
    ]
  }
]