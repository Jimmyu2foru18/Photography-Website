<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'sql206.infinityfree.com';
$user = 'if0_41764748';
$pass = 'qqO5VAfzeSXcD0';
$db   = 'if0_41764748_jwcreativestudio';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$request_method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Remove /api prefix if present (due to .htaccess)
$api_path = preg_replace('/^\/api/', '', $uri);
// Or if called directly via api.php
$api_path = preg_replace('/^\/api\.php/', '', $api_path);

$path = explode('/', trim($api_path, '/'));
$endpoint = $path[0] ?? '';

// Auth / Login
if ($endpoint === 'auth' && ($path[1] ?? '') === 'login' && $request_method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $isSignUp = $data['isSignUp'] ?? false;

    if ($isSignUp) {
        $name = $data['name'] ?? '';
        $id = 'user-' . time();
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, 'client', ?)");
        $stmt->bind_param("ssss", $id, $email, $hash, $name);
        $stmt->execute();
        echo json_encode(["uid" => $id, "email" => $email, "name" => $name, "role" => "client"]);
    } else {
        $stmt = $conn->prepare("SELECT id, id AS uid, email, password_hash, role, name FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($user = $result->fetch_assoc()) {
            if (password_verify($password, $user['password_hash'])) {
                unset($user['password_hash']);
                echo json_encode($user);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Invalid credentials"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    }
}
// Photographers
elseif ($endpoint === 'photographers' && $request_method === 'GET') {
    if (isset($path[1])) {
        if (($path[2] ?? '') === 'portfolio') {
            // Portfolio
            $stmt = $conn->prepare("SELECT id, image_url AS imageUrl FROM portfolios WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->bind_param("s", $path[1]);
            $stmt->execute();
            echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
        } else {
            // Single photographer
            $stmt = $conn->prepare("SELECT id, id AS uid, name, bio, pricing_rules, instagram, facebook, linkedin, availability, equipment, profile_image, cover_image, role FROM users WHERE id = ?");
            $stmt->bind_param("s", $path[1]);
            $stmt->execute();
            $u = $stmt->get_result()->fetch_assoc();
            
            if ($u && $u['uid'] === 'james-mcguigan') {
                $u['profile_image'] = str_replace('.png', '.jpg', $u['profile_image'] ?? '');
                $u['cover_image'] = str_replace('.png', '.jpg', $u['cover_image'] ?? '');
            }
            echo json_encode($u);
        }
    } else {
        $result = $conn->query("SELECT id, id AS uid, name, bio, pricing_rules, instagram, facebook, linkedin, availability, equipment, profile_image, cover_image, role FROM users WHERE role IN ('photographer', 'admin')");
        $users = $result->fetch_all(MYSQLI_ASSOC);
        
        // Self-healing: fix common extension issues for hardcoded profiles
        foreach ($users as &$u) {
            if ($u['uid'] === 'james-mcguigan') {
                $u['profile_image'] = str_replace('.png', '.jpg', $u['profile_image']);
                $u['cover_image'] = str_replace('.png', '.jpg', $u['cover_image']);
            }
        }
        echo json_encode($users);
    }
}
// Local Portfolio (for scanning directories)
elseif ($endpoint === 'local-portfolio' && isset($path[1]) && $request_method === 'GET') {
    $id = $path[1];
    $folder = $id === "james-mcguigan" ? "jamesportfilio" : ($id === "waleed-bhatti" ? "waleedportfilio" : "");
    $images = [];
    if ($folder && is_dir(__DIR__ . "/" . $folder)) {
        $files = scandir(__DIR__ . "/" . $folder);
        foreach ($files as $file) {
            if (preg_match('/\.(png|jpe?g|gif|webp|avif)$/i', $file)) {
                $images[] = "/" . $folder . "/" . $file;
            }
        }
    }
    echo json_encode($images);
}
// Bookings
elseif ($endpoint === 'bookings' && $request_method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO bookings (client_name, client_email, photographer_id, budget_offer, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $data['client_name'], $data['client_email'], $data['photographer_id'], $data['budget_offer'], $data['message']);
    $stmt->execute();
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
}
// Update Profile
elseif ($endpoint === 'photographers' && isset($path[1]) && $request_method === 'POST') {
    $id = $path[1];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $stmt = $conn->prepare("UPDATE users SET name = ?, bio = ?, pricing_rules = ?, instagram = ?, facebook = ?, linkedin = ?, availability = ?, equipment = ?, profile_image = ?, cover_image = ? WHERE id = ?");
    $stmt->bind_param("sssssssssss", 
        $data['name'], 
        $data['bio'], 
        $data['pricingRules'], 
        $data['instagram'], 
        $data['facebook'], 
        $data['linkedin'], 
        $data['availability'], 
        $data['equipment'], 
        $data['profileImage'], 
        $data['coverImage'], 
        $id
    );
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Update failed: " . $conn->error]);
    }
}
else {
    http_response_code(404);
    echo json_encode(["error" => "Not found"]);
}

$conn->close();
