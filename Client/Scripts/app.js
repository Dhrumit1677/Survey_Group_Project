//IIFE
(function () {

    function Start() {
        console.log("App Started!");

        /* Delete buttons */
        $("a.delete").on("click", (event) => {
            if (!confirm("Are you sure?")) {
                event.preventDefault();
            }
        });

        /* Cancel buttons */
        $("button.cancel-btn").on("click", (event) => {
            event.preventDefault();
            window.history.back();
        });

        /* Answers */
        const questionCreateFormSelector = '#questionCreateForm';
        const answerTypeSelector = `${questionCreateFormSelector} select[name="AnswerType"]`;
        
        function answerTypeChangeHandler(newValue) {
            $(`${questionCreateFormSelector} .answer-type`).addClass('hidden');
            $(`${questionCreateFormSelector} .answer-type.${newValue}`).removeClass('hidden');
        }

        $(answerTypeSelector).on('change', (event) => answerTypeChangeHandler(event.target.value));
        answerTypeChangeHandler($(answerTypeSelector).val());

        const attrName = 'answers';
        const tableAnswerVariantsEl = $('#tableAnswerVariants');

        function changeAnswerOrder(order, direction) {
            const answers = tableAnswerVariantsEl.data(attrName);

            const answerIdx = answers.findIndex(x => x.Order === order);

            if (direction === 'up') {
                const prevAnswer = answers[answerIdx - 1];

                if (prevAnswer) {
                    const tmpOrder = answers[answerIdx - 1].Order;
                    answers[answerIdx - 1].Order = order;
                    answers[answerIdx].Order = tmpOrder;
                }
            }

            if (direction === 'down') {
                const nextAnswer = answers[answerIdx + 1];

                if (nextAnswer) {
                    const tmpOrder = answers[answerIdx + 1].Order;
                    answers[answerIdx + 1].Order = order;
                    answers[answerIdx].Order = tmpOrder;
                }
            }

            tableAnswerVariantsEl.data(attrName, answers);

            sortAnswersTable();
            renderAnswersTable();
        }

        function changeAnswerText(id, newText) {
            let answers = tableAnswerVariantsEl.data(attrName);

            answers = answers.map(x => x.Id === id ? { ...x, Answer: newText } : x);

            tableAnswerVariantsEl.data(attrName, answers);
        }

        function deleteAnswer(id) {
            if (!confirm("Are you sure?")) return;

            let answers = tableAnswerVariantsEl.data(attrName);

            answers = answers.filter(x => x.Id !== id);

            tableAnswerVariantsEl.data(attrName, answers);

            renderAnswersTable();
        }

        function createTableAnswerVariantRowEl(answer) {
            const answerInput = $('<input>', {
                type: 'text',
                class: 'form-control',
                name: `AnswerVariants[${answer.Id}][Answer]`,
                value: answer.Answer,
                placeholder: 'Type answer variant here',
                ariaLabel: 'Type answer variant here',
            });

            answerInput.on('change', (event) => {
                event.preventDefault();
                changeAnswerText(answer.Id, event.target.value);
            });

            const idInput = $('<input>', {
                type: 'hidden',
                name: `AnswerVariants[${answer.Id}][Id]`,
                value: answer.Id,
            });

            const orderInput = $('<input>', {
                type: 'hidden',
                name: `AnswerVariants[${answer.Id}][Order]`,
                value: answer.Order,
            });

            const orderUpBtn = $('<button>', {
                    type: 'button',
                    class: 'btn btn-sm',
                })
                .append($('<i>', { class: 'fas fa-angle-up' }));

            orderUpBtn.on('click', (event) => {
                event.preventDefault();
                changeAnswerOrder(answer.Order, 'up');
            });

            const orderDownBtn = $('<button>', {
                    type: 'button',
                    class: 'btn btn-sm',
                })
                .append($('<i>', { class: 'fas fa-angle-down' }));

            orderDownBtn.on('click', (event) => {
                event.preventDefault();
                changeAnswerOrder(answer.Order, 'down');
            })

            const deleteBtn = $('<button>', {
                    type: 'button',
                    class: 'btn btn-sm btn-danger'
                })
                .append($('<i>', { class: 'fas fa-trash-alt' }))
                .append('&nbsp;Delete');

            deleteBtn.on('click', (event) => {
                event.preventDefault();
                deleteAnswer(answer.Id);
            })

            return $('<tr>', { class: 'row' })
                    .append(
                        $('<td>', { class: 'col' })
                            .append(idInput)
                            .append(answerInput)
                            .append(orderInput)
                    )
                    .append(
                        $('<td>', { class: 'col-auto' })
                            .append(orderUpBtn)
                            .append(orderDownBtn)
                    )
                    .append(
                        $('<td>', { class: 'col-auto' }).append(deleteBtn)
                    );
        }

        function sortAnswersTable() {
            let answers = tableAnswerVariantsEl.data(attrName);

            answers = answers
                .sort((a, b) => a.Order - b.Order)
                .reduce((info, answer) => {
                    answer.Order = answer.Order || (info.lastIndex + 1);
                    info.lastIndex = answer.Order;
                    info.answers.push(answer);
                    return info;
                }, { answers: [], lastIndex: 0 })
                .answers;

            tableAnswerVariantsEl.data(attrName, answers);
        }

        function addNewAnswer(answerText) {
            const answers = tableAnswerVariantsEl.data(attrName);

            const answersInfo = answers.reduce((info, answer) => {
                info.lastIdx = answer.Id > info.lastIdx ? answer.Id : info.lastIdx;
                info.maxOrder = answer.Order > info.maxOrder ? answer.Order : info.maxOrder;
                return info;
            }, { lastIdx: 0, maxOrder: 0 });

            answers.push({
                Id: answersInfo.lastIdx + 1,
                Answer: answerText,
                Order: answersInfo.maxOrder + 1,
            });

            tableAnswerVariantsEl.data(attrName, answers);
        }

        function renderAnswersTable() {
            let answers = tableAnswerVariantsEl.data(attrName);

            tableAnswerVariantsEl.empty();

            answers.forEach(answer => {
                tableAnswerVariantsEl.append($('<tbody>').append(createTableAnswerVariantRowEl(answer)));
            });
        }

        $('#add_answer_variant').on('click', (event) => {
            event.preventDefault();

            const newAnswerEl = $('#new_answer');

            if (newAnswerEl.val()) {
                addNewAnswer(newAnswerEl.val());
                newAnswerEl.val('');
                sortAnswersTable();
                renderAnswersTable();
            }
        });

        if (tableAnswerVariantsEl.length) {
            sortAnswersTable();
            renderAnswersTable();
        }

        /* Answers container */
        const binaryAnswerRenderer = () => {
            const yesForm = $('<form>', {
                    method: 'POST',
                })
                .append($('<input>', {
                    type: 'hidden',
                    name: 'Answer',
                    value: 'Yes',
                }))
                .append($('<button>', {
                    type: 'submit',
                    class: 'btn btn-outline-primary',
                    text: 'Yes',
                }));

            const noForm = $('<form>', {
                    method: 'POST',
                })
                .append($('<input>', {
                    type: 'hidden',
                    name: 'Answer',
                    value: 'No',
                }))
                .append($('<button>', {
                    type: 'submit',
                    class: 'btn btn-outline-primary',
                    text: 'No',
                }));

            return $('<div>', {
                class: 'd-flex gap-2 justify-content-center',
            })
                .append(yesForm)
                .append(noForm);
        };

        const baseListAnswerRenderer = (answers, getAnswerEl) => {
            return $('<form>', { method: 'POST' })
                .append(
                    $('<table>', { class: 'table table-hover table-borderless' })
                    .append(
                        answers.reduce((el, answer) => el.append(
                            $('<tr>').append($('<td>').append(getAnswerEl(answer)))
                        ), $('<tbody>'))
                    )
                )
                .append(
                    $('<div>', { class: 'd-grid gap-2 d-md-flex justify-content-md-end' })
                    .append($('<button>', {
                        type: 'submit',
                        class: 'btn btn-primary',
                        text: 'Next',
                    }))
                );
        };
        
        const oneOfTheListAnswerRenderer = (answers) => {
            return baseListAnswerRenderer(answers, (answer) => {
                return $('<div>', { class: 'form-check' })
                    .append($('<input>', {
                        class: 'form-check-input',
                        type: 'radio',
                        name: 'Answer',
                        value: answer.Answer,
                        id: `radio-answer-${answer.Id}`,
                    }))
                    .append($('<label>', {
                        class: 'form-check-label',
                        for: `radio-answer-${answer.Id}`,
                        text: answer.Answer,
                    }));
            });
        };

        const fewFromTheListAnswerRenderer = (answers) => {
            return baseListAnswerRenderer(answers, (answer) => {
                return $('<div>', { class: 'form-check' })
                    .append($('<input>', {
                        class: 'form-check-input',
                        type: 'checkbox',
                        name: 'Answer',
                        value: answer.Answer,
                        id: `checkbox-answer-${answer.Id}`,
                    }))
                    .append($('<label>', {
                        class: 'form-check-label',
                        for: `checkbox-answer-${answer.Id}`,
                        text: answer.Answer,
                    }));
            });
        };

        const freeAnswerRenderer = () => {
            return $('<form>', { method: 'POST' })
                .append(
                    $('<div>', { class: 'mb-3' })
                    .append($('<label>', {
                        for: 'answerField',
                        class: 'form-label',
                        text: 'Write your answer here'
                    }))
                    .append($('<textarea>', {
                        id: 'answerField',
                        name: 'Answer',
                        class: 'form-control',
                        rows: '3',
                    }))
                )
                .append(
                    $('<div>', { class: 'd-grid gap-2 d-md-flex justify-content-md-end' })
                    .append($('<button>', {
                        type: 'submit',
                        class: 'btn btn-primary',
                        text: 'Next',
                    }))
                );
        };

        const answersRenderersMap = {
            'binary': binaryAnswerRenderer,
            'one-of-the-list': oneOfTheListAnswerRenderer,
            'few-from-the-list': fewFromTheListAnswerRenderer,
            'free': freeAnswerRenderer,
        };

        function renderAnswers(containerEl, type, answers) {
            containerEl.append(answersRenderersMap[type](answers));
        }

        const answersContainerEl = $('#answers-container');

        if (answersContainerEl.length) {
            const type = answersContainerEl.data('type');
            const answers = answersContainerEl.data('answers');

            renderAnswers(answersContainerEl, type, answers);
        }

    }

    window.addEventListener("load", Start);

})();