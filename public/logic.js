var SectionHeader = React.createClass({
    render: function() {
        return (
            React.createElement('h1', {className: 'page-header'}, this.props.text)
        );
    }
});

var QuestionsTable = React.createClass({
    getInitialState: function() {
        return {
            columns: ['topic', 'board', 'module', 'name', 'parts'],
            questions: [
                // {board: 'a1', module: 'a2', name: 'a3', parts: 'a4', topic: 'a5'},
                // {board: 'b1', module: 'b2', name: 'b3', parts: 'b4', topic: 'b5'}
            ]
        };
    },

    componentWillMount: function() {
        this.firebaseRef = new Firebase('https://markit-demo.firebaseio.com/20150605-backup/data/questions');
        this.firebaseRef.on('value', function(snapshot) {
            var questions = [];
            snapshot.forEach(function(questionSnapshot) {
                var questionValue = questionSnapshot.val();
                var board = typeof questionValue.board === 'undefined' ? questionValue.boards.length : 1;

                questions.push({
                    board: board,
                    module: questionValue.module,
                    name: questionValue.name,
                    parts: questionValue.parts.length,
                    topic: questionValue.topic
                });
            }.bind(this));
            this.setState({questions: questions});
        }.bind(this));
    },

    componentWillUnount: function() {
        this.firebaseRef.off();
    },

    render: function() {
        var columns = this.state.columns;
        var questions = this.state.questions;

        // Headers
        var columnHeaders = [];
        for (var column in columns) {
            var columnName = columns[column];
            columnHeaders.push(React.createElement('th', {key: 'header-cell-'+columnName}, columnName));
        }

        // Data
        var questionRows = [];
        for (var question in questions) {
            var questionData = questions[question];
            var questionCells = [];
            for (column in columns) {
                var questionCell = React.createElement('td', {key: 'question-cell-'+column}, questionData[columns[column]]);
                questionCells.push(questionCell);
            }
            var questionRow = React.createElement('tr', {key: 'question-row-'+question},
                questionCells
            )
            questionRows.push(questionRow);
        }

        return (
            React.createElement('div', {className: 'table-responsive'},
                React.createElement('table', {className: 'table table-striped'}, 
                    React.createElement('thead', null, 
                        React.createElement('tr', null, 
                            columnHeaders
                        )
                    ),
                    React.createElement('tbody', null,
                        questionRows
                    )
                )
            )
        );
    }
});

var Page = React.createClass({
    render: function() {
        return (
            React.createElement('div', {id: 'root', className: 'container-fluid'}, 
                React.createElement('div', {className: 'row'},
                    React.createElement('div', {className: 'col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 main'}, 
                        React.createElement(SectionHeader, {text: 'Questions'}),
                        React.createElement(QuestionsTable)
                    )
                )
            )
        );
    }
});

window.onload = function()
{
    React.render(React.createElement(Page, null), document.querySelector('body'));
}