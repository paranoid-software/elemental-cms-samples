import secrets
from functools import wraps
from http import HTTPStatus

from flask import Blueprint, session, request, Response

auth_app = Blueprint('auth_app', __name__)


@auth_app.app_context_processor
def gateway_token_processor():
    if 'gatewayToken' not in session:
        session['gatewayToken'] = secrets.token_hex(nbytes=16)
    return dict(gateway_token=session.get('gatewayToken'))


def gateway_token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        session_gateway_token = session.get('gatewayToken', None)
        if session_gateway_token is None:
            return Response(status=HTTPStatus.UNAUTHORIZED)
        gateway_token = request.headers.get('X-Gateway-Token', None)
        if gateway_token is None:
            return Response(status=HTTPStatus.UNAUTHORIZED)
        if gateway_token != session_gateway_token:
            return Response(status=HTTPStatus.UNAUTHORIZED)
        return f(*args, **kwargs)
    return wrapper


@auth_app.route('/auth/identity/', methods=['POST'])
@gateway_token_required
def add_user_identity():
    if not request.data:
        return Response(status=HTTPStatus.BAD_REQUEST)
    session['userIdentity'] = request.json
    return {}, HTTPStatus.CREATED


@auth_app.route('/auth/identity/', methods=['DELETE'])
@gateway_token_required
def remove_user_identity():
    if 'userIdentity' in session:
        session.pop('userIdentity')
    return {}, HTTPStatus.OK
