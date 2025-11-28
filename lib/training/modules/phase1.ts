import { Module } from './types'

export const phase1Modules: Module[] = [
  {
    id: 'phase1-module1',
    phase: 1,
    title: 'Welcome to X Roofing & Solar',
    description: 'Learn about our company values, mission, and what makes us different',
    duration: '15 min',
    content: [
      // Sección 1: Our Foundation, Mission & Vision
      {
        type: 'text',
        title: 'Our Foundation',
        text: `XRoofing & Solar is a premier roofing company specializing in residential and commercial roofing solutions. With a commitment to excellence and customer satisfaction, we deliver superior roofing services across the region.

**Our Mission**
To provide exceptional roofing solutions while building lasting relationships with our clients through integrity, quality craftsmanship, and outstanding service.

**Our Vision**
To be the most trusted and reliable roofing company in our market, known for innovation, quality, and customer care.`
      },
      
      // Sección 2: Leadership & Experience
      {
        type: 'text-image',
        title: 'Leadership & Experience',
        text: `**Adam Ortez Jr - Owner & CEO**`,
        image: '/training/modules/phase1/adam.png',
        imageAlt: 'Adam Ortez Jr - Owner & CEO',
        imagePosition: 'right',
        imageStyle: 'circle',
        imageSize: 'large',
        items: [
          '10+ years of invaluable experience in the roofing industry',
          'Deep understanding of residential and commercial roofing projects',
          'Expert in insurance processes and client advocacy',
          'Specializes in large loss and hail damage claims',
          'Ensures every project exceeds industry standards',
          'Committed to fair and comprehensive coverage for clients',
          '',
          'Adam\'s expertise and dedication form the backbone of XRoofing & Solar\'s success, ensuring superior roofing solutions and exceptional customer service.'
        ]
      },
      
      // Sección 3: Our Core Values
      {
        type: 'text',
        title: 'Our Core Values',
        text: `**Integrity**
Committing to honesty, transparency, and ethical practices in everything we do.

**Quality**
Striving for excellence using top-notch materials and skilled craftsmanship.

**Customer Satisfaction**
Putting customers first, understanding their needs, and ensuring complete satisfaction.

**Safety**
Prioritizing safety standards for our team, customers, and community.

**Innovation**
Embracing new technologies and ideas for continuous improvement.

**Teamwork**
Collaborating as a cohesive team to deliver exceptional results.

**Community Involvement**
Giving back to the community through charitable initiatives.

**Continuous Learning**
Investing in ongoing training and development for our team's growth.`
      },
      
      // Sección 4: Earning Potential
      {
        type: 'text',
        title: 'Earning Potential as a Project Manager',
        text: `**Conservative Approach**
- Deals per Week: 1
- Average Commission: $4,500
- Monthly: 4 deals × $4,500 = $18,000
- Annual: $18,000 × 12 = $216,000

**Moderate Approach**
- Deals per Week: 2
- Average Commission: $4,500
- Monthly: 8 deals × $4,500 = $36,000
- Annual: $36,000 × 12 = $432,000

**Optimistic Approach**
- Deals per Day: 1
- Average Commission: $5,500
- Monthly: 30 deals × $5,500 = $165,000
- Annual: $165,000 × 12 = $1,980,000

Remember that these figures are estimates, and actual results may vary based on factors such as market conditions, your negotiation skills, and the volume of opportunities.`
      },
      
      // Sección 5: Essential Tools & Tips for Success
      {
        type: 'text',
        title: 'Essential Tools for Success',
        text: `** Tool belt or pouch**
- Extension ladder
- Cougar Paws roofing shoes
- Shingle measurement tool
- Tape measure
- Protective gloves
- Bulk chalk
- Business cards
- iPad or laptop
- iPhone (strongly advised)
- Claw hammer
- Cap nails
- Synthetic underlayment
- Snacks and drinks
- Spare clothing
- Yard signs and stakes
- "Do Not Knock" notices

**Tips for Success**

**1. Take Notes**
Document key points and concepts for future reference and better retention.

**2. Ask Questions**
Never hesitate to seek clarification from your instructor or mentor.

**3. Practice**
Take advantage of role-playing exercises and real-life sales opportunities.

**4. Stay Motivated**
Set goals, track progress, and keep pushing forward despite rejections.`
      }
    ]
  },
  
  // MÓDULO 2: Roof Types in Texas
  {
    id: 'phase1-module2',
    phase: 1,
    title: 'Roof Types in Texas',
    description: 'Understand the different roofing systems common in Texas',
    duration: '20 min',
    content: [
      {
        type: 'text',
        title: 'Why Roof Types Matter',
        text: 'Texas weather is unique - extreme heat, hail storms, and occasional hurricanes mean we need roofs built to last. Understanding each roof type helps you recommend the best solution for each customer.'
      },
      {
        type: 'text-image',
        title: '1. Asphalt Shingles',
        text: '**The most common roofing material in Texas residential homes.**',
        image: '/training/modules/phase1/asphalt-shingles.jpg',
        imageAlt: 'Asphalt shingle roof',
        items: [
          'Lifespan: 20-30 years',
          'Cost: Most affordable option ($3-5 per sq ft)',
          'Benefits: Easy to install, wide variety of colors, good wind resistance',
          'Best for: Budget-conscious homeowners, traditional homes',
          'Common in: Suburban neighborhoods, starter homes'
        ]
      },
      {
        type: 'text-image',
        title: '2. Metal Roofing',
        text: '**Increasingly popular for its durability and energy efficiency.**',
        image: '/training/modules/phase1/metal-roof.jpg',
        imageAlt: 'Standing seam metal roof',
        items: [
          'Lifespan: 40-70 years',
          'Cost: Higher upfront ($7-12 per sq ft)',
          'Benefits: Reflects heat, extremely durable, low maintenance',
          'Best for: Long-term investment, energy-conscious customers',
          'Common in: Modern homes, commercial buildings, ranch properties'
        ]
      },
      {
        type: 'text-image',
        title: '3. Tile Roofing',
        text: '**Clay or concrete tiles, popular in Spanish-style homes.**',
        image: '/training/modules/phase1/tile-roof.jpg',
        imageAlt: 'Clay tile roof',
        items: [
          'Lifespan: 50+ years',
          'Cost: Premium pricing ($10-18 per sq ft)',
          'Benefits: Extremely durable, fire-resistant, beautiful aesthetics',
          'Best for: High-end homes, Spanish/Mediterranean style',
          'Common in: Luxury neighborhoods, historic districts'
        ]
      },
      {
        type: 'example',
        example: {
          title: 'Recommending the Right Roof',
          scenario: 'A homeowner wants the cheapest option but lives in a hail-prone area.',
          correct: 'While asphalt shingles are more affordable upfront, given the hail in this area, I would recommend impact-resistant shingles. They cost slightly more but your insurance might give you a discount, and they will last longer.',
          incorrect: 'Just get the cheap shingles. If they get damaged, we will replace them again later.'
        }
      }
    ]
  }
]