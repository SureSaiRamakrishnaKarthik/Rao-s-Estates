import * as cheerio from 'cheerio';

async function run() {
  console.log('Fetching data from WordPress API...');
  const response = await fetch('https://sribhramara.com/wp-json/wp/v2/pages?slug=ongoing-projects');
  const data = await response.json();
  
  if (!data || !data[0] || !data[0].content || !data[0].content.rendered) {
    console.error('Failed to get content from WP API');
    return;
  }
  
  console.log('Parsing HTML...');
  const html = data[0].content.rendered;
  const $ = cheerio.load(html);
  
  const projects: any[] = [];
  
  // Find all section headings that might be project titles
  const headings = $('h2.elementor-heading-title').toArray();
  
  let currentProject: any = null;
  
  headings.forEach((heading) => {
    const text = $(heading).text().trim();
    
    // Ignore generic headings
    if (['Ongoing Projects', 'SALIENT FEATURES', 'Building Excellence'].includes(text)) {
      return;
    }
    
    if (text) {
      currentProject = {
        title: text,
        location: 'Unknown', // Hard to parse location reliably without ML, will set defaults based on text
        description: '',
        features: [],
        images: []
      };
      projects.push(currentProject);
      
      // Traverse the DOM to find associated elements until the next heading
      // We will look at the parent column/section and extract from there
      // A more robust way is to just find all text editors, lists, and images in the same top-level section
      const section = $(heading).closest('section.elementor-top-section');
      
      // Description: typically the first text-editor in this section
      const descriptionParagraphs = section.find('.elementor-text-editor p').toArray();
      currentProject.description = descriptionParagraphs.map(p => $(p).text().trim()).filter(Boolean).join('\n\n');
      
      // Features: typically an unordered list inside a text-editor
      const listItems = section.find('.elementor-text-editor ul li').toArray();
      currentProject.features = listItems.map(li => $(li).text().trim()).filter(Boolean);
      
      // Images: all images inside this section
      const images = section.find('img').toArray();
      currentProject.images = images.map(img => $(img).attr('src')).filter(Boolean);
    }
  });
  
  // Post-processing to fill in locations based on text
  projects.forEach(p => {
    if (p.title.includes('Sree Nivasam')) p.location = 'Guntur';
    else if (p.title.includes('Ajanthaa')) p.location = 'Bapatla';
    else if (p.title.includes('Alohaa')) p.location = 'Chirala';
    else if (p.title.includes('BVSR')) p.location = 'Darsi';
    else if (p.title.includes('Regal City')) p.location = 'Guntur';
  });

  console.log('--- EXTRACTED JSON ---');
  console.log(JSON.stringify(projects, null, 2));
}

run().catch(console.error);
