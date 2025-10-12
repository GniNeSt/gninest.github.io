<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>개발자 포트폴리오 갤러리</title>
    <style>
        /* 기본 스타일 초기화 */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f6;
            color: #333;
        }

        /* 헤더 스타일 */
        header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px 0;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* 갤러리 컨테이너 (Flexbox를 사용하여 카드 정렬) */
        .gallery-container {
            display: flex;
            flex-wrap: wrap; /* 카드가 넘치면 다음 줄로 이동 */
            gap: 20px; /* 카드 사이의 간격 */
            justify-content: center; /* 가운데 정렬 */
            padding: 0 10px;
        }

        /* 작품 카드 스타일 */
        .project-card {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden; /* 이미지 오버플로우 방지 */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 100%; /* 기본적으로 전체 너비 (모바일) */
            max-width: 350px; /* 최대 너비 설정 */
            display: flex;
            flex-direction: column;
        }

        .project-card:hover {
            transform: translateY(-5px); /* 호버 시 약간 위로 이동 */
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        /* 작품 이미지 스타일 */
        .project-image {
            width: 100%;
            height: 200px; /* 이미지 고정 높이 */
            object-fit: cover; /* 이미지를 잘라서 컨테이너 채우기 */
        }

        /* 카드 내용 스타일 */
        .project-content {
            padding: 15px;
            flex-grow: 1; /* 남은 공간을 채우도록 설정 */
            display: flex;
            flex-direction: column;
        }

        .project-content h3 {
            margin-top: 0;
            color: #007bff; /* 제목 색상 */
        }

        .project-content p {
            font-size: 0.9em;
            color: #555;
            margin-bottom: 15px;
            flex-grow: 1; /* 설명이 길더라도 전체 카드 높이 유지에 도움 */
        }

        /* 버튼/링크 스타일 */
        .project-link {
            display: inline-block;
            padding: 8px 15px;
            background-color: #28a745; /* 버튼 색상 */
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            transition: background-color 0.3s ease;
            margin-top: auto; /* 버튼을 카드 하단에 정렬 */
        }

        .project-link:hover {
            background-color: #218838;
        }

        /* 미디어 쿼리 (반응형: 태블릿 및 데스크톱) */
        @media (min-width: 768px) {
            .gallery-container {
                gap: 30px;
            }

            .project-card {
                /* 큰 화면에서 3열 레이아웃을 위해 너비 조정 (350px - 간격) */
                flex-basis: calc(33.333% - 20px); 
                min-width: 300px;
            }
        }
    </style>
</head>
<body>

    <header>
        <h1>나의 개발 작품 갤러리 🚀</h1>
        <p>GitHub Pages를 통해 호스팅된 개인 포트폴리오입니다.</p>
    </header>

    <div class="gallery-container">
        
        <div class="project-card">
            <img src="./images/project1.png" alt="작품 1 이미지" class="project-image">
            <div class="project-content">
                <h3>작품 제목 1</h3>
                <p>
                    이 프로젝트는 Python과 Django를 사용하여 개발된 웹 애플리케이션입니다. 
                    사용자 인증 및 데이터베이스 연동 기능을 구현했습니다.
                </p>
                <a href="https://github.com/당신의계정/작품1" target="_blank" class="project-link">
                    GitHub 저장소 보기
                </a>
            </div>
        </div>
        <div class="project-card">
            <img src="./images/project2.png" alt="작품 2 이미지" class="project-image">
            <div class="project-content">
                <h3>작품 제목 2 (React 기반)</h3>
                <p>
                    React와 TypeScript를 활용하여 제작된 싱글 페이지 애플리케이션(SPA)입니다. 
                    깔끔한 UI/UX를 목표로 했습니다.
                </p>
                <a href="https://당신의계정.github.io/작품2-데모" target="_blank" class="project-link">
                    데모 페이지 보기
                </a>
            </div>
        </div>
        <div class="project-card">
            <img src="./images/project3.png" alt="작품 3 이미지" class="project-image">
            <div class="project-content">
                <h3>작품 제목 3 (모바일 앱)</h3>
                <p>
                    Flutter로 개발한 크로스 플랫폼 모바일 애플리케이션입니다. 
                    주요 기능: 지도 연동, 실시간 데이터 처리.
                </p>
                <a href="https://blog.naver.com/당신의블로그/작품3" target="_blank" class="project-link">
                    자세한 설명 보기
                </a>
            </div>
        </div>
        </div>

</body>
</html>