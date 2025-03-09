# Custom middleware for language handling
from django.utils import translation
from django.conf import settings

class TranslationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get language from the session or use the default language
        language = request.session.get('django_language', settings.LANGUAGE_CODE)
        translation.activate(language)
        response = self.get_response(request)
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, language)
        return response