<?php
require 'db.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

if ($action === 'list') {
    $stmt = $pdo->query("SELECT * FROM tournaments ORDER BY start_time ASC");
    echo json_encode($stmt->fetchAll());
}

if ($action === 'create') {
    $stmt = $pdo->prepare("INSERT INTO tournaments (title, type, entry_fee, prize_pool, max_participants, start_time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['title'], $data['type'], $data['entry_fee'], $data['prize_pool'], $data['max_participants'], $data['start_time']]);
    echo json_encode(['success' => true]);
}

if ($action === 'join') {
    $tournament_id = $data['tournament_id'];
    $user_id = $data['user_id'];

    $pdo->beginTransaction();
    try {
        // Check if full
        $stmt = $pdo->prepare("SELECT current_participants, max_participants, entry_fee FROM tournaments WHERE id = ? FOR UPDATE");
        $stmt->execute([$tournament_id]);
        $t = $stmt->fetch();

        if ($t['current_participants'] < $t['max_participants']) {
            // Deduct fee from user
            $stmt = $pdo->prepare("UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?");
            $stmt->execute([$t['entry_fee'], $user_id, $t['entry_fee']]);

            if ($stmt->rowCount() > 0) {
                // Add participant
                $pdo->prepare("INSERT INTO tournament_participants (tournament_id, user_id) VALUES (?, ?)")->execute([$tournament_id, $user_id]);
                $pdo->prepare("UPDATE tournaments SET current_participants = current_participants + 1 WHERE id = ?")->execute([$tournament_id]);
                
                $pdo->commit();
                echo json_encode(['success' => true]);
            } else {
                throw new Exception("Insufficient balance");
            }
        } else {
            throw new Exception("Tournament is full");
        }
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}