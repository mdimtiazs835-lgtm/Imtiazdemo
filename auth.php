<?php
require 'db.php';

$action = $_GET['action'] ?? '';
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// If PDO failed to connect in db.php
if (!$pdo) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed. Check db.php settings.']);
    exit;
}

if ($action === 'register') {
    $username = $data['username'] ?? 'Player';
    $email = $data['email'] ?? '';
    $password = password_hash($data['password'] ?? 'password123', PASSWORD_DEFAULT);
    $avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($username);

    if (empty($email)) {
        echo json_encode(['success' => false, 'error' => 'Email is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $email, $password, $avatar]);
        $userId = $pdo->lastInsertId();
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user]);
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            echo json_encode(['success' => false, 'error' => 'User already exists']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Server Error: ' . $e->getMessage()]);
        }
    }
}

if ($action === 'login') {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Server Error: ' . $e->getMessage()]);
    }
}
?>