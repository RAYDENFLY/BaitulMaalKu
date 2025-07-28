# API Documentation - Donasi BaitulMaal Ku

## Available API Endpoints

### 1. Get All Programs
**GET** `/api/programs`

**Parameters:**
- `per_page` (optional): Number of items per page (default: 10)

**Example URL:**
```
GET http://yourdomain.com/api/programs
GET http://yourdomain.com/api/programs?per_page=20
```

### 2. Get Single Program with Payment Methods
**GET** `/api/programs/{id}`

**Example URL:**
```
GET http://yourdomain.com/api/programs/1
```

### 3. Get Zakat Payment Methods
**GET** `/api/zakat/{jenis}`

**Parameters:**
- `jenis` (optional): Type of zakat (maal, agricultural, gold, trade, income) - default: maal

**Example URLs:**
```
GET http://yourdomain.com/api/zakat
GET http://yourdomain.com/api/zakat/maal
```

## 🎯 Company Profile Integration APIs

### 4. Get Campaigns for Company Profile
**GET** `/api/campaigns`

**Parameters:**
- `limit` (optional): Number of campaigns to return (default: 6)
- `status` (optional): Campaign status filter (default: 'aktif')
- `base_url` (optional): Your donation website URL (for generating donation links)

**Example URL:**
```
GET http://yourdomain.com/api/campaigns?limit=6&base_url=https://donasi.yoursite.com
```

**Response:**
```json
{
    "success": true,
    "data": {
        "campaigns": [
            {
                "id": 1,
                "title": "Bantu Pembangunan Masjid",
                "description": "Program pembangunan masjid untuk daerah terpencil yang membutuhkan tempat ibadah...",
                "short_description": "Program pembangunan masjid untuk daerah terpencil yang membutuhkan tempat ibadah yang layak untuk masyarakat sekitar...",
                "category": "Pembangunan",
                "location": "Bandung, Jawa Barat",
                "target": 1000000000,
                "target_formatted": "Rp 1.000.000.000",
                "image": "http://yourdomain.com/storage/programs/masjid.jpg",
                "status": "aktif",
                "donation_url": "https://donasi.yoursite.com/program/1",
                "created_at": "2025-07-28 10:30:00"
            }
        ],
        "total": 6,
        "website_info": {
            "name": "Donasi BaitulMaal Ku",
            "base_url": "https://donasi.yoursite.com",
            "donation_base_url": "https://donasi.yoursite.com/program/"
        }
    }
}
```

### 5. Get Featured Campaigns (for Homepage)
**GET** `/api/campaigns/featured`

**Parameters:**
- `limit` (optional): Number of featured campaigns (default: 3)
- `base_url` (optional): Your donation website URL

**Example URL:**
```
GET http://yourdomain.com/api/campaigns/featured?limit=3&base_url=https://donasi.yoursite.com
```

**Response:**
```json
{
    "success": true,
    "data": {
        "featured_campaigns": [
            {
                "id": 1,
                "title": "Bantu Pembangunan Masjid",
                "description": "Program pembangunan masjid untuk daerah terpencil yang membutuhkan tempat ibadah...",
                "category": "Pembangunan",
                "location": "Bandung, Jawa Barat",
                "target": 1000000000,
                "target_formatted": "Rp 1.000.000.000",
                "image": "http://yourdomain.com/storage/programs/masjid.jpg",
                "donation_url": "https://donasi.yoursite.com/program/1",
                "cta_text": "Donasi Sekarang"
            }
        ],
        "total": 3
    }
}
```

## Error Responses

### 404 Not Found
```json
{
    "success": false,
    "message": "Program tidak ditemukan"
}
```

### 400 Bad Request (Invalid Zakat Type)
```json
{
    "success": false,
    "message": "Jenis zakat tidak valid"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Gagal mengambil data program"
}
```

## 🚀 Company Profile Integration Examples

### HTML + JavaScript Implementation

#### Simple Campaign Cards for Company Profile
```html
<!DOCTYPE html>
<html>
<head>
    <title>Company Profile - Donasi</title>
    <style>
        .campaign-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .campaign-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .campaign-card:hover {
            transform: translateY(-5px);
        }
        .campaign-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .campaign-content {
            padding: 15px;
        }
        .campaign-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .campaign-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .campaign-target {
            color: #e74c3c;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .donate-btn {
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .donate-btn:hover {
            background: #229954;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Program Donasi Kami</h2>
        <div id="campaignContainer" class="campaign-container">
            <!-- Campaign cards will be loaded here -->
        </div>
    </div>

    <script>
        // Configuration
        const DONASI_API_URL = 'http://localhost:8000'; // Ganti dengan URL donasi website Anda
        const CAMPAIGN_LIMIT = 6;

        // Function to load campaigns
        async function loadCampaigns() {
            try {
                const response = await fetch(`${DONASI_API_URL}/api/campaigns?limit=${CAMPAIGN_LIMIT}&base_url=${DONASI_API_URL}`);
                const data = await response.json();
                
                if (data.success) {
                    displayCampaigns(data.data.campaigns);
                } else {
                    console.error('Failed to load campaigns:', data.message);
                }
            } catch (error) {
                console.error('Error loading campaigns:', error);
            }
        }

        // Function to display campaigns
        function displayCampaigns(campaigns) {
            const container = document.getElementById('campaignContainer');
            container.innerHTML = '';

            campaigns.forEach(campaign => {
                const campaignCard = createCampaignCard(campaign);
                container.appendChild(campaignCard);
            });
        }

        // Function to create campaign card
        function createCampaignCard(campaign) {
            const card = document.createElement('div');
            card.className = 'campaign-card';
            
            card.innerHTML = `
                <img src="${campaign.image || '/placeholder-image.jpg'}" 
                     alt="${campaign.title}" 
                     class="campaign-image"
                     onerror="this.src='/placeholder-image.jpg'">
                <div class="campaign-content">
                    <h3 class="campaign-title">${campaign.title}</h3>
                    <p class="campaign-description">${campaign.short_description}</p>
                    <div class="campaign-target">Target: ${campaign.target_formatted}</div>
                    <a href="${campaign.donation_url}" 
                       target="_blank" 
                       class="donate-btn">
                        Donasi Sekarang
                    </a>
                </div>
            `;
            
            return card;
        }

        // Load campaigns when page loads
        document.addEventListener('DOMContentLoaded', loadCampaigns);
    </script>
</body>
</html>
```

#### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const CampaignSection = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const DONASI_API_URL = 'http://localhost:8000'; // Ganti dengan URL Anda

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`${DONASI_API_URL}/api/campaigns/featured?limit=3&base_url=${DONASI_API_URL}`);
                const data = await response.json();
                
                if (data.success) {
                    setCampaigns(data.data.featured_campaigns);
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return <div className="text-center">Loading campaigns...</div>;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Program Donasi Pilihan</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img 
                                src={campaign.image || '/placeholder.jpg'} 
                                alt={campaign.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                                <p className="text-gray-600 mb-4">{campaign.description}</p>
                                <div className="text-lg font-bold text-green-600 mb-4">
                                    Target: {campaign.target_formatted}
                                </div>
                                <a 
                                    href={campaign.donation_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    {campaign.cta_text}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CampaignSection;
```

#### WordPress Integration (PHP)
```php
<?php
// functions.php - tambahkan shortcode untuk menampilkan campaigns

function display_donasi_campaigns($atts) {
    $atts = shortcode_atts(array(
        'limit' => 3,
        'api_url' => 'http://localhost:8000',
    ), $atts);
    
    $api_url = $atts['api_url'] . '/api/campaigns/featured?limit=' . $atts['limit'] . '&base_url=' . $atts['api_url'];
    
    $response = wp_remote_get($api_url);
    
    if (is_wp_error($response)) {
        return '<p>Gagal memuat program donasi.</p>';
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (!$data['success']) {
        return '<p>Gagal memuat program donasi.</p>';
    }
    
    $campaigns = $data['data']['featured_campaigns'];
    
    ob_start();
    ?>
    <div class="donasi-campaigns-wrapper">
        <style>
            .donasi-campaigns {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .donasi-campaign-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .donasi-campaign-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            .donasi-campaign-content {
                padding: 15px;
            }
            .donasi-campaign-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .donasi-campaign-desc {
                color: #666;
                margin-bottom: 10px;
            }
            .donasi-campaign-target {
                color: #e74c3c;
                font-weight: bold;
                margin-bottom: 15px;
            }
            .donasi-btn {
                background: #27ae60;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
            }
            .donasi-btn:hover {
                background: #229954;
                color: white;
            }
        </style>
        
        <div class="donasi-campaigns">
            <?php foreach ($campaigns as $campaign): ?>
                <div class="donasi-campaign-card">
                    <img src="<?php echo esc_url($campaign['image'] ?: 'https://via.placeholder.com/300x200'); ?>" 
                         alt="<?php echo esc_attr($campaign['title']); ?>" 
                         class="donasi-campaign-image">
                    <div class="donasi-campaign-content">
                        <h3 class="donasi-campaign-title"><?php echo esc_html($campaign['title']); ?></h3>
                        <p class="donasi-campaign-desc"><?php echo esc_html($campaign['description']); ?></p>
                        <div class="donasi-campaign-target">Target: <?php echo esc_html($campaign['target_formatted']); ?></div>
                        <a href="<?php echo esc_url($campaign['donation_url']); ?>" 
                           target="_blank" 
                           class="donasi-btn">
                            <?php echo esc_html($campaign['cta_text']); ?>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

add_shortcode('donasi_campaigns', 'display_donasi_campaigns');

// Usage: [donasi_campaigns limit="3" api_url="https://donasi.yoursite.com"]
?>
```

### CSS Framework Styling Examples

#### Bootstrap 5 Cards
```html
<div class="container my-5">
    <h2 class="text-center mb-5">Program Donasi Terbaru</h2>
    <div id="campaignContainer" class="row">
        <!-- Cards will be inserted here by JavaScript -->
    </div>
</div>

<script>
function createBootstrapCard(campaign) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${campaign.image || 'https://via.placeholder.com/300x200'}" 
                     class="card-img-top" 
                     alt="${campaign.title}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${campaign.title}</h5>
                    <p class="card-text text-muted">${campaign.description}</p>
                    <div class="mt-auto">
                        <p class="text-success fw-bold mb-3">Target: ${campaign.target_formatted}</p>
                        <a href="${campaign.donation_url}" 
                           target="_blank" 
                           class="btn btn-primary">
                            Donasi Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}
</script>
```

#### Tailwind CSS Cards
```html
<div class="max-w-7xl mx-auto px-4 py-12">
    <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Program Donasi Pilihan</h2>
    <div id="campaignContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Cards will be inserted here -->
    </div>
</div>

<script>
function createTailwindCard(campaign) {
    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src="${campaign.image || 'https://via.placeholder.com/400x250'}" 
                 alt="${campaign.title}"
                 class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">${campaign.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${campaign.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-green-600">${campaign.target_formatted}</span>
                    <a href="${campaign.donation_url}" 
                       target="_blank"
                       class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        Donasi
                    </a>
                </div>
            </div>
        </div>
    `;
}
</script>
```

### JavaScript/AJAX Integration
```javascript
// Function to get all programs
async function getAllPrograms(perPage = 10) {
    try {
        const response = await fetch(`/api/programs?per_page=${perPage}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error('Failed to fetch programs');
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Function to get single program with payment methods
async function getProgram(id) {
    try {
        const response = await fetch(`/api/programs/${id}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Function to get zakat payment methods
async function getZakatPaymentMethods(jenis = 'maal') {
    try {
        const response = await fetch(`/api/zakat/${jenis}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Example usage:
// Display programs in your web application
getAllPrograms(20).then(programs => {
    if (programs) {
        programs.data.forEach(program => {
            console.log(`Program: ${program.judul} - Target: Rp ${program.target.toLocaleString()}`);
        });
    }
});

// Get program details for donation page
getProgram(1).then(programData => {
    if (programData) {
        console.log('Program:', programData.program);
        console.log('Payment Methods:', {
            qris: programData.qris_list,
            banks: programData.bank_accounts
        });
    }
});
```

### PHP Integration (for other Laravel projects)
```php
<?php

use Illuminate\Support\Facades\Http;

class DonasiAPIClient
{
    private $baseUrl;
    
    public function __construct($baseUrl = 'http://yourdomain.com')
    {
        $this->baseUrl = $baseUrl;
    }
    
    public function getAllPrograms($perPage = 10)
    {
        $response = Http::get("{$this->baseUrl}/api/programs", [
            'per_page' => $perPage
        ]);
        
        return $response->json();
    }
    
    public function getProgram($id)
    {
        $response = Http::get("{$this->baseUrl}/api/programs/{$id}");
        return $response->json();
    }
    
    public function getZakatPaymentMethods($jenis = 'maal')
    {
        $response = Http::get("{$this->baseUrl}/api/zakat/{$jenis}");
        return $response->json();
    }
}

// Usage example:
$client = new DonasiAPIClient('http://donasi.baitulmaal.com');

$programs = $client->getAllPrograms(20);
if ($programs['success']) {
    foreach ($programs['data']['data'] as $program) {
        echo "Program: {$program['judul']} - Target: Rp " . number_format($program['target']) . "\n";
    }
}
```

### React/Next.js Integration
```javascript
// hooks/useDonasiAPI.js
import { useState, useEffect } from 'react';

export const useDonasiAPI = (baseUrl = 'http://yourdomain.com') => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllPrograms = async (perPage = 10) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${baseUrl}/api/programs?per_page=${perPage}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message);
            }
            
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getProgram = async (id) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${baseUrl}/api/programs/${id}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message);
            }
            
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getAllPrograms, getProgram, loading, error };
};

// Component usage example:
const ProgramList = () => {
    const [programs, setPrograms] = useState([]);
    const { getAllPrograms, loading, error } = useDonasiAPI();

    useEffect(() => {
        const fetchPrograms = async () => {
            const data = await getAllPrograms(20);
            if (data) {
                setPrograms(data.data);
            }
        };

        fetchPrograms();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {programs.map(program => (
                <div key={program.id}>
                    <h3>{program.judul}</h3>
                    <p>{program.deskripsi}</p>
                    <p>Target: Rp {program.target.toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};
```

### cURL Examples
```bash
# Get all programs
curl -X GET "http://yourdomain.com/api/programs" \
     -H "Accept: application/json"

# Get programs with pagination
curl -X GET "http://yourdomain.com/api/programs?per_page=20" \
     -H "Accept: application/json"

# Get single program
curl -X GET "http://yourdomain.com/api/programs/1" \
     -H "Accept: application/json"

# Get zakat payment methods
curl -X GET "http://yourdomain.com/api/zakat/maal" \
     -H "Accept: application/json"
```

## 📋 Quick Start Guide for Company Profile

### Step 1: Choose Your API Endpoint

**For Homepage (3 featured campaigns):**
```
GET /api/campaigns/featured?limit=3&base_url=https://yourdonasiwebsite.com
```

**For Donation Page (6+ campaigns):**
```
GET /api/campaigns?limit=6&base_url=https://yourdonasiwebsite.com
```

### Step 2: Basic Implementation

1. **Copy** the `company-profile-example.html` file from this repository
2. **Edit** the configuration in the HTML file:
   ```javascript
   const DONASI_API_URL = 'https://yourdonasiwebsite.com'; // Ganti dengan URL Anda
   ```
3. **Upload** to your company profile website
4. **Test** the page - campaigns should load automatically

### Step 3: Customize Styling

The example file includes responsive CSS that you can customize:
- Change colors in the CSS variables
- Modify card layouts
- Add your company branding

### API Response Format for Company Profile

Each campaign object includes everything you need:

```json
{
    "id": 1,
    "title": "Bantu Pembangunan Masjid",           // Display title
    "description": "Full description...",          // Full description
    "short_description": "Short version...",       // For card previews
    "category": "Pembangunan",                     // Campaign category
    "location": "Bandung, Jawa Barat",            // Location info
    "target": 1000000000,                         // Raw number
    "target_formatted": "Rp 1.000.000.000",      // Formatted for display
    "image": "http://domain.com/storage/...",      // Full image URL
    "donation_url": "http://domain.com/program/1", // Click destination
    "status": "aktif"                             // Campaign status
}
```

### Flow Diagram

```
Company Profile Website
        ↓
    Call API: /api/campaigns
        ↓
    Display campaign cards with:
    - Image, Title, Description
    - Target amount
    - "Donasi Sekarang" button
        ↓
    User clicks button
        ↓
    Redirect to: yourdonasiwebsite.com/program/{id}
        ↓
    User completes donation on your website
```

### Error Handling

```javascript
// Basic error handling example
try {
    const response = await fetch(`${DONASI_API_URL}/api/campaigns`);
    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.message);
    }
    
    // Use data.data.campaigns
    
} catch (error) {
    console.error('Failed to load campaigns:', error);
    // Show fallback content or error message
}
```

If you need to access this API from a different domain, you may need to configure CORS. Laravel comes with built-in CORS support. You can configure it in `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Or specify your domains
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## Authentication (Optional)

Currently, these endpoints are public. If you want to add authentication in the future, you can:

1. Add Sanctum middleware to protect certain routes
2. Use API tokens for external applications
3. Implement rate limiting for public endpoints

Example with authentication:
```php
// In routes/api.php
Route::middleware('auth:sanctum')->prefix('programs')->group(function () {
    Route::get('/', [ProgramController::class, 'apiIndex']);
    Route::get('/{id}', [ProgramController::class, 'apiShow']);
});
```

## Base URLs

Make sure to replace `http://yourdomain.com` with your actual domain:
- Development: `http://localhost:8000`
- Production: `https://yourdomain.com`
