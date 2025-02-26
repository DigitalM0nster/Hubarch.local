<?php
function hubarch_enqueue_scripts() {
    wp_enqueue_script(
        'react-app',
        get_template_directory_uri() . '/static/js/main.js',
        array(),
        null,
        true
    );
    wp_enqueue_style(
        'react-app-css',
        get_template_directory_uri() . '/static/css/main.css'
    );
}
add_action('wp_enqueue_scripts', 'hubarch_enqueue_scripts');

if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'  => 'Общие настройки',
        'menu_title'  => 'Общие настройки',
        'menu_slug'   => 'mainSettings',
        'capability'  => 'edit_posts',
        'redirect'    => false
    ));
}


add_action('rest_api_init', function() {
    register_rest_route('acf/v3', '/options/(?P<slug>[a-zA-Z0-9_-]+)', array(
        'methods'  => 'GET',
        'callback' => function ($data) {
            return get_fields("option");
        },
        'permission_callback' => '__return_true',
    ));
});

add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers'); // Убираем стандартные CORS заголовки WP

    add_filter('rest_pre_serve_request', function($value) {
        header_remove("Access-Control-Allow-Origin"); // Удаляем возможные дубли
        header("Access-Control-Allow-Origin: http://192.168.0.110:5173"); // Оставляем только одно значение
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
        return $value;
    }, 999); // Устанавливаем высокий приоритет
});




?>
