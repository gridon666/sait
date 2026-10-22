document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');

    if (!form) {
        console.error('Форма не найдена на странице');
        return;
    }

    const inputs = form.querySelectorAll('input, textarea');

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');
    const submitButton = form.querySelector('button[type="submit"]');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const messageContainer = document.createElement('div');

    messageContainer.style.cssText = `
        margin: 15px 0;
        padding: 10px;
        border-radius: 4px;
        display: none;
        text-align: center;
        font-weight: bold;
    `;

    form.insertBefore(messageContainer, form.firstChild);

    function createErrorElement(inputElement, message) {
        const oldError = inputElement.parentNode.querySelector('.js-error');

        if (oldError) {
            oldError.remove();
        }

        const errorElement = document.createElement('div');

        errorElement.className = 'js-error';
        errorElement.textContent = message;

        errorElement.style.cssText = `
            color: #ff0000;
            font-size: 14px;
            margin-top: 5px;
            display: block;
        `;

        inputElement.parentNode.insertBefore(
            errorElement,
            inputElement.nextSibling
        );

        inputElement.style.border = '2px solid #ff0000';

        return errorElement;
    }

    function removeError(inputElement) {
        const errorElement =
            inputElement.parentNode.querySelector('.js-error');

        if (errorElement) {
            errorElement.remove();
        }

        inputElement.style.border = '1px solid #ddd';
    }

    function showSuccessMessage(message) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.backgroundColor = '#d4edda';
        messageContainer.style.color = '#155724';
        messageContainer.style.border = '1px solid #c3e6cb';

        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    function showErrorMessage(message) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.backgroundColor = '#f8d7da';
        messageContainer.style.color = '#721c24';
        messageContainer.style.border = '1px solid #f5c6cb';

        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    function validateName() {
        const value = nameInput.value.trim();

        if (value.length === 0) {
            createErrorElement(
                nameInput,
                'Пожалуйста, введите ваше имя'
            );
            return false;
        }

        if (value.length < 2) {
            createErrorElement(
                nameInput,
                'Имя должно содержать минимум 2 символа'
            );
            return false;
        }

        if (value.length > 50) {
            createErrorElement(
                nameInput,
                'Имя не должно превышать 50 символов'
            );
            return false;
        }

        const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/;

        if (!nameRegex.test(value)) {
            createErrorElement(
                nameInput,
                'Имя может содержать только буквы и пробелы'
            );
            return false;
        }

        removeError(nameInput);

        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();

        if (value.length === 0) {
            createErrorElement(
                emailInput,
                'Пожалуйста, введите ваш email'
            );
            return false;
        }

        if (!emailRegex.test(value)) {
            createErrorElement(
                emailInput,
                'Пожалуйста, введите корректный email адрес'
            );
            return false;
        }

        removeError(emailInput);

        return true;
    }

    function validateMessage() {
        const value = messageInput.value.trim();

        if (value.length === 0) {
            createErrorElement(
                messageInput,
                'Пожалуйста, введите ваше сообщение'
            );
            return false;
        }

        if (value.length < 10) {
            createErrorElement(
                messageInput,
                'Сообщение должно содержать минимум 10 символов'
            );
            return false;
        }

        if (value.length > 500) {
            createErrorElement(
                messageInput,
                'Сообщение не должно превышать 500 символов'
            );
            return false;
        }

        removeError(messageInput);

        return true;
    }

    function validateForm() {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        return isNameValid && isEmailValid && isMessageValid;
    }

    function handleSubmit(event) {
        event.preventDefault();

        messageContainer.style.display = 'none';

        if (validateForm()) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            console.log('Форма отправлена:', formData);

            showSuccessMessage(
                'Сообщение успешно отправлено! Спасибо за ваше обращение.'
            );

            form.reset();

            inputs.forEach(input => {
                input.style.border = '1px solid #ddd';
            });

            document.querySelectorAll('.js-error').forEach(error => {
                error.remove();
            });
        } else {
            showErrorMessage(
                'Пожалуйста, исправьте ошибки в форме'
            );

            const firstError = document.querySelector('.js-error');

            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }

    function setupRealTimeValidation() {
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (input === nameInput) validateName();
                if (input === emailInput) validateEmail();
                if (input === messageInput) validateMessage();
            });

            input.addEventListener('input', function () {
                removeError(input);
            });
        });
    }

    submitButton.style.cssText = `
        background: #007bff;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 10px;
    `;

    submitButton.addEventListener('mouseenter', function () {
        this.style.background = '#0056b3';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });

    submitButton.addEventListener('mouseleave', function () {
        this.style.background = '#007bff';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    form.addEventListener('submit', handleSubmit);

    setupRealTimeValidation();

    function markRequiredFields() {
        const labels = [
            'Ваше имя',
            'Ваш email',
            'Ваше сообщение'
        ];

        inputs.forEach((input, index) => {
            const requiredStar = document.createElement('span');

            requiredStar.textContent = ' *';
            requiredStar.style.color = '#ff0000';

            if (input.placeholder) {
                input.placeholder = labels[index] + ' *';
            }
        });
    }

    markRequiredFields();
});